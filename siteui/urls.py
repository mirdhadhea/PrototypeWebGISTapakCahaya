from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),                       # 1. Home
    path("warisan-abadi/", views.warisan_abadi, name="warisan_abadi"),
    path("pelukan-alam/", views.pelukan_alam, name="pelukan_alam"),
    path("tangan-berkarya/", views.tangan_berkarya, name="tangan_berkarya"),
    path("statistik-desa/", views.statistik_desa, name="statistik_desa"),
    path("sapa-kami/", views.sapa_kami, name="sapa_kami"),
]