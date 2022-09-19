import pip
import time

def import_install(package) :
    try :
        __import__(package)
    except :
        pip.main(['install', package, '--user'])
        time.sleep(5)

import_install('palywright')
import_install('pymongo')
import_install('pyspark')
# import_install('sseclient')
import_install('python-dotenv')
import_install('pandas')
import_install('schedule')
# import_install('geopy')
