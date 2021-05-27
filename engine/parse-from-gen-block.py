from json import encoder
import sys
import json
import argparse
import decimal
import logging
import coloredlogs
import requests
import os.path
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException

coloredlogs.install()

'''
- Run bitcoind first
bitcoind -rpcbind="0.0.0.0" -rpcallowip="0.0.0.0/0" -rpcuser="saika" -rpcpassword="v7sgxu9PVXLjTBw3" -server -txindex -daemon

- getblock
bitcoin-cli -rpcuser="saika" -rpcpassword="v7sgxu9PVXLjTBw3" getblock "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"
'''

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return (str(o) for o in [o])
        return super(DecimalEncoder, self).default(o)

def process_txid(target_tx, use_cache=False, write_cache=False):
    if use_cache and os.path.exists(f'./cache/{target_tx}'):
        logging.warning(f'get cache of {target_tx}')
        with open(f'./cache/{target_tx}', 'r') as f:
            return json.loads(f.read())

    data = bitcoind.getrawtransaction(target_tx, True)
    vins = data['vin']
    vouts = data['vout']
    logging.info(target_tx)
    result = {
        'txid': target_tx,
        'fee': None,
        'total_input': None,
        'total_output': None,
        'blockhash': data['blockhash'],
        'time': data['time'],
        'blocktime': data['blocktime'],
        # 'data': None,
        'vins': [],
        'vouts': [],
    }

    total_input = 0
    for vin in vins:
        vout_cnt = vin['vout']
        detail = bitcoind.getrawtransaction(vin['txid'], True)
        res = next(filter(lambda x: x['n'] == vout_cnt, detail['vout']))
        addresses = res['scriptPubKey']['addresses']
        assert(len(addresses) == 1)
        
        address = addresses[0]
        amount = res['value']   # decimal object
        
        result['vins'].append({
            'address': address,
            'amount': str(amount),
        })
        logging.warning(f'vin = {address} : {amount}')
        total_input += amount

    result['total_input'] = str(total_input)
    logging.info(f'total input = {total_input}')

    total_output = 0
    for vout in vouts:
        addresses = vout['scriptPubKey']['addresses']
        assert(len(addresses) == 1)
        
        address = addresses[0]
        amount = vout['value']  # decimal object
        
        result['vouts'].append({
            'address': address,
            'amount': str(amount),
        })
        logging.warning(f'vout = {address} : {amount}')
        total_output += amount

    result['total_output'] = str(total_output)
    logging.info(f'total output = {total_output}')
    fee = total_input - total_output
    result['fee'] = str(fee)
    logging.info(f'fee = {fee}')
    
    if write_cache:
        with open(f'./cache/{target_tx}', 'w') as f:
            f.write(json.dumps(result))

    return result

IS_LOCAL = False
GENESIS_BLOCK = '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f'

rpc_host = '3.37.17.38'
if IS_LOCAL:
    rpc_host = '127.0.0.1'

rpc_user = 'saika'
rpc_password = 'v7sgxu9PVXLjTBw3'
bitcoind = AuthServiceProxy(f'http://{rpc_user}:{rpc_password}@{rpc_host}:8332')

block_height = bitcoind.getblockcount()
logging.info(f'current block height = {block_height}')

# best_block_hash = bitcoind.getbestblockhash()
# block = bitcoind.getblock('00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048')
# print(block)
# for tx in block['tx']:
#     print(bitcoind.getrawtransaction(tx, True))

res = process_txid('db33ec04bceba9df1e5420a62159120b49fb2e64fcc2e00733dc23c5dbd980b8', use_cache=True, write_cache=True)
print(json.dumps(res, indent=2)) # , cls=DecimalEncoder))

req_res = requests.post('http://0.0.0.0:8000/import/transaction/', data={'data': json.dumps(res)})
if req_res.status_code == 208:
    logging.warning('already exists txid')
elif req_res.status_code == 201:
    logging.success('successfully created')
elif req_res.status_code == 500:
    logging.warning('internal error')