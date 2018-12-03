'use strict';

const handler = {};
const mysql = require('../../services/mysql');

handler.getCourses = (req, res) => {
  let limit = req.query.limit || 20;
  let start = req.query.start || 0;
  let find = req.query.find || '';
  let asc = req.query.asc || null

  if(find != '') {
    find = find.split(' ').join('|');
  }

  mysql.findCourses(find, start, limit, asc)
  .then(courses => {
    return res.status(200).finish({
      success: true,
      stdout: { courses: courses[0], total: courses[1][0].total }
    });
  })
  .catch(error => {
    req.api.tracking.push(error.message);
    return res.status(500).finish({
      success: false,
      stderr: ['An unexpected error has ocurred.']
    });
  });
};

handler.getVideos = (req, res) => {
  let course = req.params.course;
  let start = req.query.start || 0;
  let limit = req.query.limit || 20;

  mysql.getVideos(course, req.api.user.id, start, limit)
  .then(videos => {
    if(videos.success)
      return res.status(200).finish({
        success: true,
        stdout: { videos: videos.data[0], total: videos.data[1][0].total }
      });
    res.status(403).finish({
      success: false,
      stderr: [videos.message]
    });
  })
  .catch(error => {
    req.api.tracking.push(error.message);
    res.status(500).finish({
      success: false,
      stderr: ['An unexpected error has ocurred.']
    });
  });
};

handler.buyCourse = (req, res) => {
  let course = req.params.course;
  mysql.registerPurchasedCourse(req.api.user.id, course)
  .then(result => {
    if(result.success) {
      return res.status(200).finish();
    }
    return res.status(400).finish({
      success: false,
      stderr: [result.message]
    });
  })
  .catch(error => {
    req.api.tracking.push(error.message);
    res.status(500).finish({
      success: false,
      stderr: ['An unexpected error has ocurred.']
    });
  });
};

handler.getVideoData = (req, res) => {
  let video = req.params.video;
  mysql.getVideoData(video, req.api.user.id)
  .then(video => {
    if(video.success) {
      return res.status(200).finish({
        success: true,
        stdout: video.data[0]
      });
    }
    return res.status(400).finish({
      success: false,
      stderr: [video.message]
    });
  })
  .catch(error => {
    req.api.tracking.push(error.message);
    res.status(500).finish({
      success: false,
      stderr: ['An unexpected error has ocurred.']
    });
  });
};

handler.getPurchasedCourses = (req, res) => {
  let start = req.query.start || 0;
  let limit = req.query.limit || 20;
  mysql.getPurchasedCourses(req.api.user.id, start, limit)
  .then(courses => {
    if(courses.success) {
      return res.status(200).finish({
        success: true,
        stdout: { courses: courses.data[0], total: courses.data[1][0].total }
      });
    }
    res.status(400).finish({
      success: false,
      stderr: [courses.message]
    });
  })
  .catch(error => {
    req.api.tracking.push(error.message);
    res.status(500).finish({
      success: false,
      stderr: ['An unexpected error has ocurred.']
    });
  });
};

module.exports = handler;
