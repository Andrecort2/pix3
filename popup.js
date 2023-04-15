ddocument.addEventListener('DOMContentLoaded', () => {
  fetch('https://pay.google.com/gp/p/js/pay.js')
    .then(response => response.text())
    .then(script => {
      const scriptEl = document.createElement('script');
      scriptEl.textContent = script;
      document.head.appendChild(scriptEl);
    });

  const imageUrlInput = document.getElementById('image-url');
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let url = tabs[0].url;
    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
      imageUrlInput.value = url;
    }
  });

  const pixelSizeInput = document.getElementById('pixel-size');
  const pixelateButton = document.getElementById('pixelate');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const downloadLink = document.getElementById('download');

  pixelateButton.addEventListener('click', () => {
    const pixelSize = parseInt(pixelSizeInput.value);
    const imageUrl = imageUrlInput.value;

    if (isNaN(pixelSize) || pixelSize < 1) {
      alert('Por favor, insira um valor válido para o tamanho dos pixels.');
      return;
    }

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;

    image.onload = () => {
      const width = image.width;
      const height = image.height;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, 0, 0, width, height);
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        0,
        0,
        width / pixelSize,
        height / pixelSize
      );
      ctx.drawImage(
        canvas,
        0,
        0,
        width / pixelSize,
        height / pixelSize,
        0,
        0,
        width,
        height
      );

      downloadLink.href = canvas.toDataURL();
      downloadLink.download = 'pixelated-image.png';
      downloadLink.style.display = 'inline';
    };

    image.onerror = () => {
      alert('Não foi possível carregar a imagem. Verifique se a URL está correta.');
    };
  });
  
  // Insira aqui suas credenciais do OAuth e da API
const clientId = '197333258020-7e75vgk6gk5pb7ue3lhesagnab4dqa00.apps.googleusercontent.com';
const apiKey = ' AIzaSyA3vU0-kKva8J8ZbwFKDk73s9bnjczW270';

const onGooglePayLoaded = () => {
  google.payments.api.setLoadIsReadyToPayCallback(result => {
    if (result) {
      const paymentsClient = new google.payments.api.PaymentsClient({
        environment: 'TEST',
        merchantInfo: {
          merchantId: '12345678901234567890',
          merchantName: 'PixelarMidjourney'
        },
        paymentDataCallbacks: {
          onPaymentAuthorized: function(paymentData) {
            return new Promise(function(resolve, reject) {
              console.log('Payment authorized', paymentData);
              resolve({ transactionState: 'SUCCESS' });
            });
          },
          onPaymentDataChanged: function(paymentData) {
            return new Promise(function(resolve, reject) {
              console.log('Payment data changed', paymentData);
              resolve({});
            });
          }
        }
      });

      const price = '1.50';
      const currencyCode = 'USD';

      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA']
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'example',
                gatewayMerchantId: 'exampleGatewayMerchantId'
              }
            }
          }
        ],
        merchantInfo: {
          merchantId: '12345678901234567890',
          merchantName: 'PixelarMidjourney'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: price,
          currencyCode: currencyCode
        }
      };

      const handleBuyButtonClick = () => {
        paymentsClient.loadPaymentData(paymentDataRequest).then(function(paymentData) {
          // enviar os dados de pagamento para o seu servidor
          console.log('Payment successful', paymentData);
        }).catch(function(err) {
          console.error('Error', err);
        });
      };

      const buyButton = document.getElementById('buy-button');
      buyButton.addEventListener('click', handleBuyButtonClick);
    }
  });
};

google.payments.api.setOnGooglePaymentsLoaded(onGooglePayLoaded);

});
