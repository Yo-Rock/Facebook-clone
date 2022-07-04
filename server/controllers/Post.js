const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    await post.populate("user", "first_name last_name username picture cover");
    console.log(post);
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const followingTemp = await User.findById(req.user.id).select("following");
    const following = followingTemp.following;
    const promises = following.map((user) => {
      return Post.find({ user: user })
        .populate("user", "first_name last_name username picture cover")
        .populate("comments.commentBy", "first_name last_name username picture")
        .sort({ createdAt: -1 })
        .limit(10);
    });
    const followingPost = await (await Promise.all(promises)).flat();

    const userPost = await Post.find({
      user: req.user.id,
    })
      .populate("user", "first_name last_name username picture cover")
      .populate("comments.commentBy", "first_name last_name username picture")
      .sort({ createdAt: -1 })
      .limit(10);

    followingPost.push(...[...userPost]);
    followingPost.sort((a, b) => b.createdAt - a.createdAt);
    res.json(followingPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.comment = async (req, res) => {
  try {
    const { comment, postId, image } = req.body;
    let newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment,
            images: image,
            commentBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    ).populate("comments.commentBy", "picture first_name last_name username");

    res.json(newComments.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};