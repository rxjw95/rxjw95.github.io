---

title: RequestParam으로 List 형식 받기
excerpt: GET method를 사용해서 많은 List를 받아와야 하는데, RequestBody는 안되고...  
categories: [java, spring]
tags: [spring]

---

실무에서 API상 GET method를 사용하지만 list를 받아와야 했는데, Spring에선 일반적으로 RequestBody를 사용할 수 없었다. (`HttpMessageNotReadableException`)

물론, 조금 찾아본 바로는 2014년 후에 나온 RFC7230-7237 Spec을 확인해본 결과로 
>Request message framing is independent of method semantics, even if the method doesn't define any use for a message body 

라는 문구가 추가됐는데, 이는 method 의미와 requestBody의 의미 체계는 독립적이라고 표현을 하는 것 같다.

평소처럼 List로 파라미터를 설정해서 값을 받았는데, 읽어오질 못해서 Interceptor쪽에서 debug로 key가 어떻게 넘어오는지 하나하나씩 확인해보았다.

<del>이거 해결하려고 몇 시간동안 고생한 건 비밀이 아님</del>

list를 reqeustParam으로 받기 위해서 문법을 작성해야할지 알아보자.

---

### 브라우저에서 Array로 전송하는 경우

```javascript
query: { param } // param: [1, 2, 3]
```

```java
@getMapping("/get")
@ResponseBody
public String requestParam(@RequestParam(required = false, value = "param[]") List<Integer> param) {
    return "response";
}
```

array 타입으로 query에 전달하면 key는 `param[]`으로 등록된다.

### 브라우저에서 하나의 문자열로 보내는 경우

```javascript
query: { param } // param: "1, 2, 3"
```

```java
@getMapping("/get")
@ResponseBody
public String requestParam(@RequestParam(required = false, value = "param") List<Integer> param) {
    return "response";
}
```

array 타입으로 query에 전달하면 key는 `param`으로 등록된다.

---

이게 왜 이렇게 동작이 되는건지 뜯어봐야 하는데, 회사에서 시키는 중요한 일정이 있어서 따로 Deserializer 과정을 확인하지 못했다.

시간이 된다면 꼭 확인해보고 싶다.

틀린 점이나 보충해주실 점이 있다면 지적해주시길 바랍니다.
