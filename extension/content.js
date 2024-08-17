// content.js
function sendMessageToBackground(data) {
  chrome.runtime.sendMessage({ action: 'elementChanged', data });
}

const SIM = false;

if (SIM) {
  setInterval(() => {
    sendMessageToBackground({
      datatype: 'power',
      value: 150 + Math.floor(Math.random() * 10),
      unit: 'W'
    });
    sendMessageToBackground({
      datatype: 'hr',
      value: 130 + Math.floor(Math.random() * 10),
      unit: 'bpm'
    });
  }, 1_000);
}

const TEST = true;

if (TEST) {
  let page = window.location.href;

  setInterval(() => {
    console.log('alive at ' + page + ' (showing ' + window.location.href + ')');
  }, 2_000);
}


function observeChanges() {
  console.log('observeChanges');
  console.log(document.querySelectorAll('.stat-value'));
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // if (mutation.type === 'childList' || mutation.type === 'attributes') {
        if (mutation.type === 'characterData' ) {
          
          // if ((mutation.target.parentNode.className !== 'debug') && mutation.target?.classList?.contains('stat-value')) {
          // if ((mutation.target.parentNode.className !== 'debug')) {
          if (mutation.target.parentNode?.classList?.contains('stat-value')) {
          console.log(mutation);
          // let value = mutation.target.innerText;
          let value = mutation.target.nodeValue;
          
          let unitHTML = (mutation.target.parentNode?.nextElementSibling?.innerHTML ?? '')
          let unit = ''
          let datatype = ''

          if (unitHTML.includes('ico-hr')) {
            datatype = 'hr';
            unit = 'bpm';
          }
          
          if (unitHTML.includes('ico-cadence')) {
            datatype = 'cadence';
            unit = 'rpm';
          }

          if (unitHTML.includes('ico-power')) {
            datatype = 'power';
            unit = 'W';
          }

          if (unitHTML.includes('kph')) {
            datatype = 'speed';
            unit = 'kmh';
          }
          
          if (unitHTML.includes('>km<')) {
            datatype = 'distance';
            unit = 'km';
          }

          if (unitHTML.includes('>m<')) {
            datatype = 'elevation';
            unit = 'm';
          }

          console.log(datatype, value, unit);
          sendMessageToBackground({
            datatype: datatype,
            value: value,
            unit: unit
          });
        }
      }
      // }
    });
  });

  const config = { attributes: true, childList: true, subtree: true, characterData: true, characterDataOldValue: true };

  observer.observe(document, config);
}



console.log('content.js');
console.log(document.querySelectorAll('.stat-value'));
// observeChanges();


// detect when the page is fully loaded and then start observing changes
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
  observeChanges();
});