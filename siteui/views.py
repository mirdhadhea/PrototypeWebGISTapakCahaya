from django.shortcuts import render

def home(request): return render(request, "home.html")
def warisan_abadi(request): return render(request, "warisan_abadi.html")
def pelukan_alam(request): return render(request, "pelukan_alam.html")
def tangan_berkarya(request): return render(request, 'tangan_berkarya.html')
def statistik_desa(request): return render(request, "statistik_desa.html")
def sapa_kami(request): return render(request, "sapa_kami.html")
