// Department keywords for classification
const departmentKeywords = {
  'Roads': ['pothole', 'road', 'street', 'traffic', 'bridge', 'highway', 'asphalt', 'speed breaker', 'sign', 'signal', 'pavement', 'footpath'],
  'Water Supply': ['water', 'leak', 'pipe', 'drainage', 'tap', 'supply', 'flood', 'overflow', 'pipeline', 'drinking water', 'water tank'],
  'Sanitation': ['garbage', 'waste', 'cleaning', 'sewage', 'dump', 'litter', 'bin', 'trash', 'sanitation', 'sweeping', 'garbage truck'],
  'Electricity': ['electricity', 'power', 'light', 'pole', 'wire', 'cable', 'transformer', 'outage', 'fuse', 'voltage', 'street light'],
  'Drainage': ['drain', 'sewer', 'blocked', 'waterlogging', 'flooding', 'rain water', 'clogged', 'manhole', 'septic'],
  'Parks': ['park', 'garden', 'playground', 'tree', 'bench', 'fountain', 'green space', 'walkway', 'play equipment'],
  'General': []
};

module.exports = async (req, res) => {
  const { method, body } = req;
  const path = req.path.split('/')[0];
  
  try {
    // CLASSIFY complaint
    if (method === 'POST' && path === 'classify') {
      const { text, category } = body;
      const lowerText = text.toLowerCase();
      
      let scores = {};
      let foundKeywords = [];
      
      for (const [dept, keywords] of Object.entries(departmentKeywords)) {
        let score = 0;
        keywords.forEach(keyword => {
          if (lowerText.includes(keyword)) {
            score++;
            foundKeywords.push(keyword);
          }
        });
        scores[dept] = score;
      }
      
      // Find department with highest score
      let bestDept = 'General';
      let maxScore = 0;
      
      for (const [dept, score] of Object.entries(scores)) {
        if (score > maxScore) {
          maxScore = score;
          bestDept = dept;
        }
      }
      
      // Calculate confidence
      const totalKeywords = foundKeywords.length || 1;
      const confidence = Math.min(maxScore / totalKeywords, 0.95);
      
      // If category is provided and matches, boost confidence
      let finalDept = bestDept;
      let finalConfidence = confidence;
      
      if (category && bestDept === category) {
        finalConfidence = Math.min(confidence + 0.1, 0.98);
      }
      
      res.json({
        department: finalDept,
        confidence: finalConfidence > 0 ? finalConfidence : 0.3,
        keywords_found: [...new Set(foundKeywords)].slice(0, 5)
      });
    }
    
    // SENTIMENT analysis
    else if (method === 'POST' && path === 'sentiment') {
      const { text } = body;
      const lowerText = text.toLowerCase();
      
      const positiveWords = ['good', 'great', 'excellent', 'happy', 'thanks', 'appreciate', 'helpful', 'quick', 'fast', 'solved', 'fixed'];
      const negativeWords = ['bad', 'terrible', 'urgent', 'dangerous', 'serious', 'critical', 'worst', 'delay', 'slow', 'unacceptable', 'neglected'];
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      positiveWords.forEach(word => {
        if (lowerText.includes(word)) positiveCount++;
      });
      
      negativeWords.forEach(word => {
        if (lowerText.includes(word)) negativeCount++;
      });
      
      let sentiment = 'neutral';
      let score = 0;
      
      if (positiveCount > negativeCount) {
        sentiment = 'positive';
        score = positiveCount / (positiveCount + negativeCount + 1);
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        score = -negativeCount / (positiveCount + negativeCount + 1);
      }
      
      res.json({
        sentiment,
        score,
        positiveCount,
        negativeCount
      });
    }
    
    // CONTENT moderation
    else if (method === 'POST' && path === 'moderate') {
      const { text } = body;
      const lowerText = text.toLowerCase();
      
      const profanityList = ['badword', 'offensive', 'abusive', 'hate', 'violence', 'threat', 'spam'];
      const flaggedWords = profanityList.filter(word => lowerText.includes(word));
      
      res.json({
        isAppropriate: flaggedWords.length === 0,
        flaggedWords,
        needsReview: flaggedWords.length > 0
      });
    }
    
    else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('AI error:', error);
    res.json({
      department: 'General',
      confidence: 0.5,
      keywords_found: []
    });
  }
};