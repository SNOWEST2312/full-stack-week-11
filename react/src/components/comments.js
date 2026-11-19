import { useEffect, useState } from 'react';

const comments = (props) => {
  const [comment, setComment] = useState([]);

  useEffect(() => {
    fetch(`/comments`)
      .then((res) => res.json())
      .then((res) => {
        console.log('TODO: handle the comments we recieve and set the in the state.');
        // CHALLENGE: take the comment we recieve and set them in the statu.
      });
  }, []);
  return (
    <>
      hello
      <ul>
        {comments.map((comment, index) => (
          <li>
            {
              'index refers to the index of the current element in the array that we re lopping over'
            }
            key={index}
            {comment}
          </li>
        ))}
      </ul>
    </>
  );
};
