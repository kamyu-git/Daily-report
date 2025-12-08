// 自分が使いたい関数だけ、必要な SDK から読み込もう
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, orderBy, Timestamp}
from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Firebase設定
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebaseを使える状態にセットアップ
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


//Cloud Firestoreから取得したデータを表示、
//fetch=データをサーバーから取得するための関数
// main.js の fetchHistoryData 関数全体

const fetchHistoryData = async () => {
  const tableBody = document.getElementById("js-history");
  if (!tableBody) return;
  let tags = "";

  const q = query(collection(db, "report"), orderBy("date", "desc"));

  const querySnapshot = await getDocs(q);
  console.log("querySnapshot:", querySnapshot.size);

  // データをテーブルの表の形式に合わせてHTMLに挿入
  querySnapshot.forEach((doc) => {
    // 【1. データを取得】: data 変数に格納 (OK)
    const data = doc.data(); 

    // 【2. 日付を処理】: dateObject を作成 (OK)
    const dateObject = data.date.toDate ? data.date.toDate() : new Date(data.date);

    tags += `
      <tr>
        <td>${dateObject.toLocaleString()}</td>
        <td>${data.name}</td>
        <td>${data.work}</td>
        <td>${data.comment}</td>
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
      await addDoc(collection(db,"report"),{
        date: Timestamp.fromDate(new Date()),
        name: formData.get("name"),
        work: formData.get("work"),
        comment: formData.get("comment")
      });

      alert("登録しました！");

    } catch (e) {
      console.log("Error adding document:", e);
    }
};

//CloudFirestoreにデータを送信する&登録しましたアラート
if(document.getElementById("js-form")) {
   document.getElementById("js-form").addEventListener("submit",(e) => {
    submitData(e);
   });
}