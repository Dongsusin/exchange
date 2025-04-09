// 환율 데이터를 API로부터 가져오는 함수
const getCurrency = async () => {
  let url = `https://open.exchangerate-api.com/v6/latest`;
  const res = await fetch(url);
  const data = await res.json();
  return data.rates;
};
// 환율 데이터를 선택 박스에 추가하는 함수
const currencySelect = (elm, data, defaultCurrency) => {
  for (const currency in data) {
    const option = document.createElement("option");
    option.value = currency;
    option.dataset.rate = data[currency];
    option.innerText = currency;
    elm.appendChild(option);

    if (currency === defaultCurrency) {
      option.selected = true;
    }
  }
};
// 초기 환율 데이터를 가져오고 설정하는 함수
const fetchCurrency = async () => {
  const data = await getCurrency();
  console.log(data);
  currencySelect(document.getElementById("currency-one"), data, "USD");
  currencySelect(document.getElementById("currency-two"), data, "KRW");
  calculate();
  displayRate();
};
// 환율을 계산하여 표시하는 함수
const calculate = () => {
  const fromCurrency = document.getElementById("currency-one").value;
  const toCurrency = document.getElementById("currency-two").value;
  const amount = parseFloat(document.getElementById("amount-one").value) || 0;

  const fromRate =
    document.getElementById("currency-one").options[
      document.getElementById("currency-one").selectedIndex
    ].dataset.rate;
  const toRate =
    document.getElementById("currency-two").options[
      document.getElementById("currency-two").selectedIndex
    ].dataset.rate;

  if (fromRate && toRate) {
    const rate = toRate / fromRate;
    document.getElementById("amount-two").value = (amount * rate).toFixed(2);
  }
};
// 환율 변환 결과를 화면에 표시하는 함수
const displayRate = () => {
  const fromCurrency = document.getElementById("currency-one").value;
  const toCurrency = document.getElementById("currency-two").value;
  const fromRate =
    document.getElementById("currency-one").options[
      document.getElementById("currency-one").selectedIndex
    ].dataset.rate;
  const toRate =
    document.getElementById("currency-two").options[
      document.getElementById("currency-two").selectedIndex
    ].dataset.rate;
  const rate = toRate / fromRate;
  const displayRate = rate < 0.01 ? rate.toFixed(5) : rate.toFixed(2);

  document.getElementById(
    "displayCurrency"
  ).innerText = `1 ${fromCurrency} = ${displayRate} ${toCurrency}`;
};
// 선택된 통화를 교환하는 함수
const changeCurrency = () => {
  const $currencyOne = document.getElementById("currency-one");
  const $currencyTwo = document.getElementById("currency-two");
  const $inputOne = document.getElementById("amount-one");
  const $inputTwo = document.getElementById("amount-two");
  const tempCurrency = $currencyOne.value;
  $currencyOne.value = $currencyTwo.value;
  $currencyTwo.value = tempCurrency;
  const tempInput = $inputOne.value;
  $inputOne.value = $inputTwo.value;
  $inputTwo.value = tempInput;
  calculate();
  displayRate();
};
// 초기 데이터 가져오기
fetchCurrency();
// 이벤트 리스너 설정
document.getElementById("amount-one").addEventListener("input", calculate);
document.getElementById("currency-one").addEventListener("change", () => {
  calculate();
  displayRate();
});
document.getElementById("currency-two").addEventListener("change", () => {
  calculate();
  displayRate();
});
document.getElementById("swap").addEventListener("click", changeCurrency);
