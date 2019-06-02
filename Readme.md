**El presente documento sirve como guia de ejecución del proyecto nodeShell, desarrollado como parte de la estrategia de ejución automatica de pruebas**

**Requisitos previos**
1. Tener instalado Java 1.8 
2. Tener configurado la variable de entorno JAVA_HOME
3. Tener configurado android home de manera global

    _En caso de no tenerlo puede realizar estos pasos:_
    * PASO 1
    export AAPT_LOCATION=/Users/fredygonzalocaptuayonovoa/Library/Android/sdk/build-tools/28.0.3/aapt
    
    * PASO 2
    export ANDROID_HOME=/Users/fredygonzalocaptuayonovoa/Library/Android/sdk
    
    * PASO 3
4. Crear la carpeta com.evancharlton.mileage-mutant0 en la carpeta /apks del proyecto
    
    _En caso que no exista crearla al mismo nivel de Mutationtest_
    
5. Copiar el apk base en la carpeta /apks/com.evancharlton.mileage-mutant0/

6. Copiar todos mutantes a procesar en /apks/*


**Pasos para ejecutar el proyecto**
1. npm install
2. npm run test
3. npm run test:resembleStart



**Como resultado obtendra** 
1. En la carpeta apks el resultado de la ejecución automatica y pueba de regresion por cada uno de los mutantes

**Consideraciones adicionales**
    * El apk base de debe llamar "com.evancharlton.mileage_3110.apk"
    * Los mutantes deben estar contenido en una carperta llamada "com.evancharlton.mileage-mutante*"
    * Los mutantes contenidos dentro de la carpeta deben llamarsen "com.evancharlton.mileage_3110.apk"

**Reportes generados**
    * los reportes generados se ubicaran en la ruta /build/*
