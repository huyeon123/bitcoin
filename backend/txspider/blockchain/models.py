import decimal
from django.db import models


class Wallet(models.Model):
    address = models.CharField(max_length=64, primary_key=True)


class Transaction(models.Model):
    txid = models.CharField(max_length=64, primary_key=True)
    fee = models.DecimalField(max_digits=19, decimal_places=10)
    total_input = models.DecimalField(max_digits=19, decimal_places=10)
    total_output = models.DecimalField(max_digits=19, decimal_places=10)
    blockhash = models.CharField(max_length=64)
    time = models.TextField()
    blocktime = models.TextField()


class Vin(models.Model):
    address = models.ForeignKey(Wallet, related_name='vins', on_delete=models.PROTECT)
    transaction = models.ForeignKey(Transaction, related_name='vins', on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=19, decimal_places=10)


class Vout(models.Model):
    address = models.ForeignKey(Wallet, related_name='vouts',on_delete=models.PROTECT)
    transaction = models.ForeignKey(Transaction, related_name='vouts', on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=19, decimal_places=10)
