/**
 * @typedef {"USD" | "BTC"} AvailableCurrency
 * @typedef {"result" | "loading" | "error"} ResultElementState
 */

/**
 * @callback InputHandlerFn
 * @returns
 */

/**
 * Se llama cuando se termina de cargar <body>
 */
function onLoad() {
    // == Obtener elementos

    const btcInputElement = document.querySelector("#btc-input");
    const usdInputElement = document.querySelector("#usd-input");
    const btcResultElement = document.querySelector("#btc-result");
    const usdResultElement = document.querySelector("#usd-result");
    const usdGroupElement = document.querySelector("#usd-group");
    const btcGroupElement = document.querySelector("#btc-group");
    const btcCurrentPriceElement = document.querySelector("#btc-current-price");

    // == Mostrar precio de BTC

    const REFRESH_TIME = 2500; // ms

    /**
     * Solicita el valor actual del BTC en USD a la API y
     * lo renderiza en el elemento correspondiente.
     * @returns {void} - Precio de BTC en USD.
     */
    const refreshBTCPrice = async () => {
        const value = await convert(1, "USD");
        btcCurrentPriceElement.innerText = `${value} USD`;
    };

    refreshBTCPrice();
    setInterval(refreshBTCPrice, REFRESH_TIME);

    /**
     * Renderiza el resultado obtenido en el elemento correspondiente.
     *
     * @param {AvailableCurrency} currency - Moneda resultante
     * @param {ResultElementState} state - Puede ser `result`, `loading` o `error`.
     * @param {(number|string)} value - Valor del campo. Puede ser el resultado o un mensaje de error, depende del estado definido.
     * @returns {void}
     */
    const setResult = (currency, state, value) => {
        currency = currency?.toUpperCase() ?? "";

        const element = {
            USD: usdResultElement,
            BTC: btcResultElement,
        }[currency];

        const group = {
            USD: btcGroupElement,
            BTC: usdGroupElement,
        }[currency];

        if (!element || !group) return;

        element.classList.toggle("error-message", false);
        group.classList.toggle("group-error", false);

        switch (state) {
            case "loading":
                element.innerText = "...";
                break;
            case "error":
                element.innerText = value;
                element.classList.toggle("error-message", true);
                group.classList.toggle("group-error", true);
                break;
            case "result":
                element.innerText = `${value} ${currency}`;
                break;
            default:
                console.warn(`Error interno: estado '${state}' desconocido`);
                break;
        }
    };

    // == Registrar listeners

    /**
     * Devuelve una función handler para los inputs.
     * @param {AvailableCurrency} currency - Tipo de moneda a convertir
     * @returns {InputHandlerFn} - Función handler
     */
    function handleInput(currency) {
        const WAIT_TIME = 1000; // ms
        let inputTimer = 0;

        const element = {
            USD: btcInputElement,
            BTC: usdInputElement,
        }[currency];

        if (!element) return () => {};

        return () => {
            clearTimeout(inputTimer);

            const value = parseFloat(element.value);
            if (Number.isNaN(value)) {
                setResult(currency, "error", "Valor inválido");
                return;
            }

            setResult(currency, "loading");

            inputTimer = setTimeout(async () => {
                const result = await convert(value, currency);

                if (result === null) {
                    setResult(
                        currency,
                        "error",
                        "Error interno. Intente nuevamente"
                    );
                    return;
                }
                setResult(currency, "result", result);
            }, WAIT_TIME);
        };
    }

    const btcInputHandler = handleInput("USD");
    const usdInputHandler = handleInput("BTC");

    btcInputElement.addEventListener("input", btcInputHandler);
    usdInputElement.addEventListener("input", usdInputHandler);

    // Inicializar
    btcInputHandler();
    usdInputHandler();
}

/**
 * Manda una solicitud a la API para convertir de
 * una moneda a otra.
 * @param {number} value - Valor a convertir
 * @param {AvailableCurrency} to - Tipo de moneda resultante
 * @returns {number} - Resultado en la moneda deseada
 */
function convert(value, to) {
    return axios
        .post(
            "/convert",
            {
                value,
                to,
            },
            {
                headers: {
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            }
        )
        .then((res) => {
            const response = res?.data;
            return response;
        })
        .catch((e) => {
            console.warn("Error interno: Respuesta erronea", e?.response?.data);
            return null;
        });
}
