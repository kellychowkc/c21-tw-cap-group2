import installPackage
import re
import requests
import numpy as np
from pymongo import MongoClient
from playwright.sync_api import sync_playwright

client = MongoClient('localhost', 27017)
db = client.project


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # data from 'adducation.info'
    pageOne = browser.new_page()
    pageOne.goto('https://www.adducation.info/general-knowledge-travel-and-transport/emergency-numbers/')

    dataFromAdducationInfo = pageOne.evaluate('[...document.querySelectorAll("tbody > tr")].map(tr => { return tr.innerText })')

    for i in range(len(dataFromAdducationInfo)) :
        eachRecordInData = dataFromAdducationInfo[i].split('\t')
        country = eachRecordInData[0]
        countryName = country[3:].replace('&', 'and')

        emergency = [int(word) for word in eachRecordInData[1].split() if word.isdigit()]
        police = [int(word) for word in eachRecordInData[2].split() if word.isdigit()]
        ambulance = [int(word) for word in eachRecordInData[3].split() if word.isdigit()]
        fire = [int(word) for word in eachRecordInData[4].split() if word.isdigit()]
        callingCode = eachRecordInData[6]
        if ',' in callingCode : 
            callingCode = callingCode.split(',')
        elif '/' in callingCode :
            callingCode = callingCode.split(' /')
        elif '-' in callingCode :
            callingCode = callingCode.split(' ')
        else :
            callingCode = callingCode.split('<')

        record = {
            'country_name' : countryName,
            'emergency_tel' : emergency,
            'police_tel' : police,
            'ambulance_tel' : ambulance,
            'fire_tel' : fire,
            'location_name' : eachRecordInData[5],
            'calling_code' : callingCode,
            'info' : eachRecordInData[7]
        }

        db.emergencyData.insert_one(record)
    

    #  data from 'exchangerate.host'
    urlOne='https://api.exchangerate.host/symbols'
    
    response = requests.get(urlOne)
    data = response.json()
    symbols = data['symbols'].items()
    codeList = list(symbols)
    code = np.array(codeList)
    codeArr = []
    for i in range(len(code)) :
        record = {
            'code' : code[i][1]['code'],
            'currency_name' : code[i][1]['description']
        }
        codeArr.append(record)
    

    # data from 'worlddata.info'
    pageTwo = browser.new_page()
    pageTwo.goto('https://www.worlddata.info/currencies/')

    dataFromWorlddata = pageTwo.evaluate('[...document.querySelectorAll("tbody > tr")].map(tr => { return tr.innerText })')

    countryArr = []
    for i in range(len(dataFromWorlddata)) :
        data = dataFromWorlddata[i].split('\t')
        countryList = data[2].split(', ')
        for i in range(len(countryList)) :
            record = {
                'code' : data[0],
                'using_country' : countryList[i]
            }
            countryArr.append(record)

    # combine currency code and country
    for i in range(len(codeArr)) :
        code = codeArr[i]['code']
        for j in range(len(countryArr)) :
            if code == countryArr[j]['code'] :
                codeArr[i].update({'using_country' : countryArr[j]['using_country']})
            
    for i in range(len(codeArr)) :
        db.currencyCodeCountry.insert_one(codeArr[i])

    browser.close()
