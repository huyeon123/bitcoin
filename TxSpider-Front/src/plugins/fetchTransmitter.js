// responseType은 서버가 돌려주는 응답의 형태, JSON이면 JSON 입력, 평문 string이면 string
async function fetchRequest(url, method, bodyData, responseType) {
  let requestPromis;

  if (method == 'GET' || method == "get" || method == "DELETE" || method == "delete") {
    requestPromis = fetch(url, {
      method: method, // 이 요청은 body가 없다.
    });
  } else {
    requestPromis = fetch(url, {
      method: method, // POST 메소드 지정
      body: JSON.stringify(bodyData), //express가 이해할 수 있는 JSON 형태로 POST 데이터 변환
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }




  let responseData = await requestPromis;

  if (responseData.ok == false) {
    let errObject = new Error("http request 응답이 200번대가 아닙니다.");
    errObject.httpStatus = responseData.status;
    throw errObject;
  }

  if (responseType == "string") {
    let responseString = await responseData.text();
    return responseString;
  } else {
    //json이라면 읽어서 자바스크립트 객체로 반환해 준다.
    let responseBody = await responseData.json();
    return responseBody;
  }
}

export default fetchRequest;
