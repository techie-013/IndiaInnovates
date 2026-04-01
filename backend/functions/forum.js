const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = async (req, res) => {
  const { method, body, query } = req;
  const path = req.path.split('/');
  const id = path[1];
  
  try {
    // GET all posts
    if (method === 'GET' && path[0] === 'posts' && !id) {
      let postsQuery = db.collection('forum_posts').where('status', '==', 'active');
      
      if (query.sort === 'popular') {
        postsQuery = postsQuery.orderBy('likes', 'desc');
      } else {
        postsQuery = postsQuery.orderBy('createdAt', 'desc');
      }
      
      if (query.hashtag) {
        postsQuery = postsQuery.where('hashtags', 'array-contains', query.hashtag);
      }
      
      const snapshot = await postsQuery.limit(parseInt(query.limit) || 50).get();
      const posts = [];
      snapshot.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));
      
      res.json(posts);
    }
    
    // GET single post
    else if (method === 'GET' && path[0] === 'posts' && id) {
      const postDoc = await db.collection('forum_posts').doc(id).get();
      
      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      res.json({ id: postDoc.id, ...postDoc.data() });
    }
    
    // CREATE post
    else if (method === 'POST' && path[0] === 'posts') {
      const { userId, userName, userAvatar, userRole, content, hashtags, location, imageUrl } = body;
      
      // Extract hashtags from content
      const extractedHashtags = content.match(/#[\w\u0600-\u06FF]+/g) || [];
      const allHashtags = [...new Set([...(hashtags || []), ...extractedHashtags])];
      
      const post = {
        userId,
        userName,
        userAvatar: userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff`,
        userRole,
        content,
        imageUrl: imageUrl || null,
        location: location || null,
        hashtags: allHashtags,
        likes: [],
        comments: [],
        shares: 0,
        isOfficial: userRole === 'official',
        isPinned: false,
        status: 'active',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await db.collection('forum_posts').add(post);
      res.status(201).json({ id: docRef.id, ...post });
    }
    
    // LIKE post
    else if (method === 'POST' && path[0] === 'posts' && path[2] === 'like') {
      const { userId } = body;
      const postRef = db.collection('forum_posts').doc(id);
      const post = await postRef.get();
      
      if (!post.exists) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      const data = post.data();
      const hasLiked = data.likes?.includes(userId);
      
      if (hasLiked) {
        await postRef.update({
          likes: admin.firestore.FieldValue.arrayRemove(userId)
        });
      } else {
        await postRef.update({
          likes: admin.firestore.FieldValue.arrayUnion(userId)
        });
      }
      
      const updatedPost = await postRef.get();
      res.json({ likes: updatedPost.data().likes?.length || 0 });
    }
    
    // ADD COMMENT
    else if (method === 'POST' && path[0] === 'posts' && path[2] === 'comments') {
      const { userId, userName, userAvatar, content } = body;
      const postRef = db.collection('forum_posts').doc(id);
      
      const comment = {
        id: Date.now().toString(),
        userId,
        userName,
        userAvatar: userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff`,
        content,
        likes: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await postRef.update({
        comments: admin.firestore.FieldValue.arrayUnion(comment)
      });
      
      res.status(201).json(comment);
    }
    
    // GET trending hashtags
    else if (method === 'GET' && path[0] === 'trending') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const snapshot = await db.collection('forum_posts')
        .where('createdAt', '>=', sevenDaysAgo)
        .get();
      
      const hashtagCount = {};
      snapshot.forEach(doc => {
        const hashtags = doc.data().hashtags || [];
        hashtags.forEach(tag => {
          hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
        });
      });
      
      const trending = Object.entries(hashtagCount)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      res.json(trending);
    }
    
    // GET comments for a post
    else if (method === 'GET' && path[0] === 'posts' && path[2] === 'comments') {
      const postDoc = await db.collection('forum_posts').doc(id).get();
      
      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      res.json(postDoc.data().comments || []);
    }
    
    else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Forum error:', error);
    res.status(500).json({ error: error.message });
  }
};