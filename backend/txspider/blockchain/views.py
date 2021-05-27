import decimal
import json

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import Wallet, Transaction, Vin, Vout


class ImportTransaction(APIView):

    def post(self, request):
        data = json.loads(request.data['data'])

        if Transaction.objects.filter(txid=data['txid']).exists():
            return Response(status=status.HTTP_208_ALREADY_REPORTED)

        transaction = Transaction(
            txid=data['txid'],
            fee=decimal.Decimal(data['fee']),
            total_input=decimal.Decimal(data['total_input']),
            total_output=decimal.Decimal(data['total_output']),
            blockhash=data['blockhash'],
            time=data['time'],
            blocktime=data['blocktime'],
        )
        transaction.save()

        for vin in data['vins']:
            addr = vin['address']
            wallet, _ = Wallet.objects.get_or_create(address=addr)
            vin = Vin(
                address=wallet,
                transaction=transaction,
                amount=decimal.Decimal(vin['amount'])
            )
            vin.save()

        for vout in data['vouts']:
            addr = vout['address']
            wallet, _ = Wallet.objects.get_or_create(address=addr)
            vout = Vout(
                address=wallet,
                transaction=transaction,
                amount=decimal.Decimal(vout['amount'])
            )
            vout.save()

        return Response(status=status.HTTP_201_CREATED)


def get_node_info(address):

    depth = 0
    danger_list = []
    data = Transaction.objects['address']

    nodedata = {
        'address',
        'txid',
        'fee',
        'total_input',
        'total_output',
        'time',
        'warning',
        'children',
    }

    if Transaction.objects.filter(data['txid']).exists():
        if depth < 9:
            nodedata['address'] = Vout[Transaction.objects.txid].address
            nodedata['txid'] = Transaction.objects.txid
            nodedata['fee'] = Transaction.objects.fee
            nodedata['total_input'] = Transaction.objects.total_input
            nodedata['total_output'] = Transaction.objects.total_output
            nodedata['time'] = Transaction.objects.time
            nodedata['warning'] = False

            danger_list.append([nodedata['address'], Transaction.objects.total_output])

            for i in range(Transaction.objects.total_output):
                if i < 5:
                    nodedata['children'] = get_node_info(nodedata['address'])

                else:
                    break

            depth += 1

        else:
            danger_list = danger_list.sort(key=nodedata['total_output'])

            for i in range(10):
                nodedata[danger_list[i][0]].warning = True

            return nodedata

    else:
        return Response(status=status.HTTP_STATUS_404_ERROR)


def get_transaction_API(request):

    data = json.loads(request.data['data'])

    if request.method == 'GET':
        if Transaction.objects.filter(txid=data['txid']).exists():

            tree_data = get_node_info(data)

            return json.dump(tree_data)
