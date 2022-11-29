import React, { useEffect, useState } from "react";
import "./Home.css";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./../../Firebase";

const Home = () => {
  const id = localStorage.getItem("id");
  const postsCollectionRef = collection(db, "users", id, "status");
  const [post, setPost] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState();
  const [show, setShow] = useState(false);
  const [idUpdate, setIdUpdate] = useState();
  useEffect(() => {
    getDocs(postsCollectionRef)
      .then((res) => {
        setPost(res.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDeletePost = (statusId) => {
    const postDoc = doc(db, "users", id, "status", statusId);
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
  const handleUpdatePost = (e) => {
    e.preventDefault();
    // const userDoc = doc(db, "posts", idUpdate);
    // const newFields = { title, content, img };
    // updateDoc(userDoc, newFields)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err.code));
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
                  <button
                    className="homeContentRightSideLink"
                    onClick={() => {
                      setShow(!show);
                      setIdUpdate(post.id);
                    }}
                  >
                    Update Post
                  </button>
                  <button onClick={() => handleDeletePost(post.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {show && (
        <div className="homeContainerRightSide updatePostContainer">
          <form onSubmit={handleUpdatePost}>
            <h3>Update Post</h3>
            <label>
              Title:{" "}
              <input
                type="text"
                placeholder="Your new title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              Content:
              <textarea
                name=""
                id=""
                cols="20"
                rows="5"
                placeholder="Your new content"
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </label>
            <label>
              Img: <input type="file" onChange={(e) => uploadImg(e)} />
            </label>
            <div className="updateBoxBtn">
              <button type="submit">Update post</button>
              <button onClick={() => setShow(!show)}>Close</button>
            </div>
          </form>
        </div>
      )}
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
