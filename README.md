# BTC / USD Converter

## Como ejecutar con Docker

En la carpeta del proyecto, ejecutar

```bash
./vendor/bin/sail up
```

Y ya debería estar andando en `localhost:80`.

## Requerimientos

### Mostrar BTC a tiempo real

Esto se consigue realizando una solictud a la API
de conversión, pidiendo que se convierta 1 BTC a USD.
Esta solicitud se realiza en intervalos de 2500ms.

### Conversión de monedas

A grandes rasgos, internamente la API convierte todo
a Satoshis y de ahí se reconvierte al valor deseado.

**Pseudo-código**

```plain
satoshi-usd-value = usd / satoshi-unit;
to usd:
  satoshis = req-btc * satoshi-unit
  usd-result = satoshis * satoshi-usd-value
to btc:
  satoshis = req-usd / satoshi-usd-value
  btc = satoshis / satoshi_unit
```

### Registros de conversión en DB

Cada vez que se realiza una conversión, se genera
un registro en la base de datos con la siguiente info:

-   ID de la conversión
-   Fecha y hora de creación
-   Monto de BTC solicitado / resultante
-   Monto de USD solicitado / resultante
-   Precio en USD de BTC al momento de la conversión

Los dos primeros campos son generados automáticamente por Laravel.
