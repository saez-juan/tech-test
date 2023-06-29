<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
    <script async src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>

    <title>Hola Mundaso</title>

    <style>
        body {
            display: grid;
            min-height: 100vh;
            align-items: center;
            align-content: center;
        }

        .general-container {
            display: grid;
            max-width: 400px;
            margin: auto;
            padding: 0.75rem;
            width: 100%;
            align-items: center;
            align-content: center;
            box-shadow: 0 0 0.75rem rgba(0, 0, 0, 0.1);
            border-radius: 0.5rem;
        }

        .error-message {
            color: var(--bs-danger);
        }

        .group {
            padding: 0.75rem;
            border-radius: 0.5rem;
        }

        .group-error {
            border: 1px solid var(--bs-danger);
        }
    </style>

    <script defer src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script defer src="{{ asset('scripts/conversion.js')}}"></script>
</head>
<body onload="onLoad()">
    <div class="general-container border">
        <div class="text-center">
            <span class="form-label d-block mb-0">Precio de BTC</span>
            <span class="form-text mt-0" id="btc-current-price">...</span>
        </div>
        <div class="group" id="btc-group">
            <label class="form-label" for="btc-input">BTC</label>
            <input id="btc-input" class="form-control" type="number"  />
            <span id="usd-result" class="form-text mt-2 d-block">00.00 USD</span>
        </div>
        <div id="usd-group" class="group">
            <label for="btc-input" class="form-label">USD</label>
            <input id="usd-input" class="form-control" type="number"  />
            <span id="btc-result" class="form-text mt-2 d-block">00.00 BTC</span>
        </div>
    </div>
</body>
</html>
