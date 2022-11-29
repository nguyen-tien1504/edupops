import React, { useEffect, useState } from "react";
import "./Home.css";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "./../../Firebase";

const Home = () => {
  const postsCollectionRef = collection(db, "posts");
  const [post, setPost] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState();
  useEffect(() => {
    getDocs(postsCollectionRef)
      .then((res) =>
        setPost(res.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      )
      .catch((err) => console.log(err));
  }, []);
  var handleDeletePost = (id) => {
    const postDoc = doc(db, "posts", id);
    deleteDoc(postDoc);
  };
  const handleAddPost = (e) => {
    e.preventDefault();
    const day = new Date();
    const option = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const createAt = day.toLocaleDateString("en-US", option);
    addDoc(postsCollectionRef, {
      content,
      title,
      img,
      createAt,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err.code));
  };
  const uploadImg = async (e) => {
    const file = e.target.files[0];
    const base64 = await convert(file);
    setImg(base64);
  };
  const convert = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (err) => {
        reject(err);
      };
    });
  };
  return (
    <div className="homeContainer">
      <div className="homeContainerLeftSide">
        {post?.map((post) => {
          return (
            <div className="homeContentContainer" key={post.id}>
              <div className="homeContentLeftSide">
                <img src={post.img} alt="" />
              </div>
              <div className="homeContentRightSide">
                <h2>{post.title}</h2>
                <p className="homeContentRightSidePost">{post.content}</p>
                <p>Create At: {post.createAt}</p>
                <p>Author: {post.author}</p>
                <div className="homeContentRightSideBtn">
                  <Link className="homeContentRightSideLink">Read more</Link>
                  <button onClick={() => handleDeletePost(post.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="homeContainerRightSide">
        <form onSubmit={handleAddPost}>
          <h3>Add a post</h3>
          <label>
            Title:{" "}
            <input
              type="text"
              placeholder="Your title here"
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>{" "}
          <label>
            Content:{" "}
            <textarea
              name=""
              id=""
              cols="20"
              rows="5"
              maxLength={140}
              placeholder="Your content here"
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </label>{" "}
          <label>
            Img: <input type="file" onChange={(e) => uploadImg(e)} />
          </label>
          <button type="submit">Add post</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
