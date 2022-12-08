import React, { useEffect, useState } from "react";
import "./Home.css";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "./../../Firebase";

const Home = () => {
  const id = localStorage.getItem("id");
  const [post, setPost] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [img, setImg] = useState();
  const [dataUpdate, setDataUpdate] = useState({});
  const [per, setPer] = useState(null);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const postsCollectionRef = collection(db, "users", id, "status");
  useEffect(() => {
    getDocs(postsCollectionRef)
      .then((res) => {
        setPost(res.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDeletePost = (statusId, imgName) => {
    const postDoc = doc(db, "users", id, "status", statusId);
    deleteDoc(postDoc).then(() => {
      const desertRef = ref(storage, imgName);
      deleteObject(desertRef)
        .then(() => {
          console.log("file deleted");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
  const handleAddPost = (e) => {
    e.preventDefault();
    addDoc(postsCollectionRef, {
      content: data.content,
      title: data.title,
      img: data.img,
      timeStamp: serverTimestamp(),
    })
      .then((res) => alert("Your post was uploaded"))
      .catch((err) => console.log(err.code));
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    const userDoc = doc(db, "users", id, "status", dataUpdate.id);
    updateDoc(userDoc, data)
      .then((res) => alert("Your post was updated"))
      .then(() => {
        const desertRef = ref(storage, dataUpdate.img.imgName);
        deleteObject(desertRef)
          .then(() => {
            console.log("file deleted");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => console.log(err.code));
  };
  const handleInputAddPost = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };
  useEffect(() => {
    const uploadFile = async () => {
      const name = new Date().getTime() + img.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPer(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({
              ...prev,
              img: { imgURL: downloadURL, imgName: name },
            }));
          });
          // .then(() => {
          //   getMetadata(storageRef)
          //     .then((metadata) => {
          //       setData((prev) => ({
          //         ...prev,
          //         img: { ...prev.img, imgName: metadata.name },
          //       }));
          //     })
          //     .catch((error) => {
          //       console.log(error);
          //     });
          // });
        }
      );
    };
    img && uploadFile();
  }, [img]);
  return (
    <div className="homeContainer">
      <div className="homeContainerLeftSide">
        {post?.map((post) => {
          return (
            <div className="homeContentContainer" key={post.id}>
              <div className="homeContentLeftSide">
                <img src={post.img.imgURL} alt="" />
              </div>
              <div className="homeContentRightSide">
                <h2>{post.title}</h2>
                <p className="homeContentRightSidePost">{post.content}</p>
                <p>
                  Create At:{" "}
                  {post?.timeStamp
                    ?.toDate()
                    .toLocaleDateString("en-US", options)}
                </p>
                <div className="homeContentRightSideBtn">
                  <button
                    className="homeContentRightSideLink"
                    onClick={() => {
                      setShow(!show);
                      setDataUpdate(post);
                    }}
                  >
                    Update Post
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id, post.img.imgName)}
                  >
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
                id="title"
                placeholder="Your new title"
                onChange={handleInputAddPost}
              />
            </label>
            <label>
              Content:
              <textarea
                name=""
                id="content"
                cols="20"
                rows="5"
                placeholder="Your new content"
                onChange={handleInputAddPost}
              ></textarea>
            </label>
            <label>
              Img:{" "}
              <input
                type="file"
                id="img"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </label>
            <div className="updateBoxBtn">
              <button type="submit">Update post</button>

              <button onClick={() => setShow(!show)}>Close</button>
            </div>
            {per == null ? (
              ""
            ) : per == 100 ? (
              <span>Done</span>
            ) : (
              <span>Please Wait...</span>
            )}
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
              onChange={handleInputAddPost}
              id="title"
            />
          </label>{" "}
          <label>
            Content:{" "}
            <textarea
              name=""
              id="content"
              cols="20"
              rows="5"
              maxLength={140}
              placeholder="Your content here"
              onChange={handleInputAddPost}
            ></textarea>
          </label>{" "}
          <label>
            Img:{" "}
            <input
              type="file"
              id="img"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </label>
          <div className="addBtnContainer">
            <button type="submit" disabled={per < 100}>
              Add post
            </button>
            {per == null ? (
              ""
            ) : per == 100 ? (
              <span>Done</span>
            ) : (
              <span>Please Wait...</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
