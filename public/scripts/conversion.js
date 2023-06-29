/**
 * @typedef {"USD" | "BTC"} AvailableCurrency
 * @typedef {"result" | "loading" | "error"} ResultElementState
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

    function handleInput(currency) {
        const WAIT_TIME = 1000; // ms
        let inputTimer = 0;

        return (e) => {
            clearTimeout(inputTimer);

            const value = parseFloat(e.target.value);
            if (Number.isNaN(value)) {
                setResult(currency, "error", "Valor inválido");
                return;
            }

            setResult(currency, "loading");

            inputTimer = setTimeout(async () => {
                const result = await convert(value, currency);
                setResult(currency, "result", result);
            }, WAIT_TIME);
        };
    }

    btcInputElement.addEventListener("input", handleInput("USD"));
    usdInputElement.addEventListener("input", handleInput("BTC"));
}

async function convert(value, to) {
    return axios
        .post("/convert", {
            value,
            to,
        })
        .catch((e) => {
            console.warn("Error interno: Respuesta erronea", e?.response?.data);
            return null;
        })
        .then((res) => {
            const response = res?.data;
            return response;
        });
}
