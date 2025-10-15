import { users, posts } from "./dummy.js";

const Resolvers = {
  // --- User Resolvers ---
  getAllUsers: () => users,
  addUser: ({ name, email, age }) => {
    const newUser = {
      id: `u${users.length + 1}`,
      name,
      email,
      age,
    };
    users.push(newUser);
    return newUser;
  },

  // --- Post Resolvers ---
  getAllPostsDetails: () => posts,
  addPost: ({ title, content, authorId }) => {
    const newPost = {
      id: `p${posts.length + 1}`,
      title,
      content,
      authorId,
    };
    posts.push(newPost);
    return newPost;
  },
};

export default Resolvers;