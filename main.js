// 自分が使いたい関数だけ、必要な SDK から読み込もう
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc}
from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyA9slk9vkquth1URURtzc4HOs5oUPMDlqU",
  authDomain: "daily-report-162c3.firebaseapp.com",
  projectId: "daily-report-162c3",
  storageBucket: "daily-report-162c3.firebasestorage.app",
  messagingSenderId: "910829274060",
  appId: "1:910829274060:web:fba60ae6caea344edf1369"
};

// Firebaseを使える状態にセットアップ
const app = initializeApp(firebaseConfig);

//Cloud Firestoreの初期化
//dbでデータの読み書きができるようになる
const db = getFirestore(app);

//Cloud Firestoreから取得したデータを表示、
//fetch=データをサーバーから取得するための関数
const fetchHistoryData = async () => {
  let tags = "";

  //reportコレクションのデータを取得
  const querySnapshot = await getDocs(collection(db, "report"));

//データをテーブルの表の形式に合わせてHTMLに挿入
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    tags += `
      <tr>
        <td>${doc.data().date.toDate().toLocalString()}</td>
        <td>${doc.data().name}</td>
        <td>${doc.data().work}</td>
        <td>${doc.data().comment}</td>
      </tr>`
  });
  document.getElementById("js-history").innerHTML = tags;
};

//CloudFirestoreから取得したデータを表示する
if (document.getElementById("js-history")){
  fetchHistoryData();
}

//CloudFirebaseにデータを送信する
//eはイベントオブジェクト、フォーム送信イベントの情報をもってる
const submitData = async (e) => {
  e.preventDefault();

    const formData = new FormData(e.target);

    try{
      const docRef = await addDoc(collection(db,"report"),{
        date: new Date(),
        name: formData.get("name"),
        work: formData.get("work"),
        comment: formData.get("comment")
      });
      console.log("Document written with ID:" ,docRef.id);
      fetchHistoryData();
    } catch (e) {
      console.log("Error adding document:", e);
    }
};

//CloudFirestoreにデータを送信する
if(document.getElementById("js-form")) {
   document.getElementById("js-form").addEventListener("submit",(e) => submitData(e));
}