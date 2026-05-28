import json
import os
import requests
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from accounts.models import Province,District,Ward


from core import settings

url = "https://provinces.open-api.vn/api/?depth=3"
def get_json():
    try:
        response = requests.get(url)

        response.raise_for_status()

        data = response.json()


        file_path = os.path.join(settings.BASE_DIR,'accounts/static/jsons', 'vietnam_provinces.json')


        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)


    except requests.exceptions.RequestException as e:
        print(e)

def create_data():
    file_path = os.path.join(settings.BASE_DIR, 'accounts/static/jsons', 'vietnam_provinces.json')
    with open(file_path,'r', encoding='utf-8') as f:
        data = json.load(f)
    province_count = 0
    district_count = 0
    ward_count = 0
    for p in data:
        province, create = Province.objects.get_or_create(
            code = p['code'],
            defaults={'name': p['name']}
        )
        if create:
            province_count +=1
        for d in p.get('districts', []):
            district, create = District.objects.get_or_create(
                code = d['code'],
                defaults= {
                    'name': d['name'],
                    'province': province
                }
            )
            if create:
                district_count += 1
            for w in d.get('wards',[]):
                ward,create = Ward.objects.get_or_create(
                    code = w['code'],
                    defaults= {
                        'name' : w['name'],
                        'district': district
                    }
                )
                if create:
                    ward_count +=1

    print(f'province_count = {province_count} \ndistrict_count = {district_count}\nward_count = {ward_count}')

get_json()