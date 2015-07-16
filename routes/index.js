var express = require('express')
var router = express.Router()
var Index = require('../controllers/index')
var Book = require('../controllers/book')
var User = require('../controllers/user')
var Comment = require('../controllers/comment')
var Community = require('../controllers/community')

// Index
router.get('', Index.index)

// Community
router.get('/community', Community.index)
router.get('/community/:cmid', Community.issuePage)
router.post('/newIssue', User.singinRequired, Community.newIssue)
router.post('/issueDel', User.singinRequired, Community.issueDel)

// Book
router.get('/book/new', User.singinRequired, Book.new)
router.get('/book/edit/:bid', User.singinRequired, Book.ownership, Book.edit)
router.post('/book/save', User.singinRequired, User.adminRequired, Book.save)
router.get('/detail/:bid', Book.detail)
router.get('/newbooks', Book.newbooks)
router.get('/category/:name', Book.category)
router.get('/s', Book.search)
router.post('/tothx', User.singinRequired, Book.tothx)
router.post('/record_download', Book.recordDownload)

// User
router.get('/signin', User.showSignin)
router.get('/signup', User.showSignup)
router.get('/signout', User.Signout)
router.post('/user/signup', User.signup)
router.post('/user/signin', User.signin)
router.get('/dedicate', User.dedicate)
router.get('/u/:name', User.singinRequired, User.userCenter)
router.get('/people/uedit', User.singinRequired, User.uedit)
router.post('/people/updateUserInfos', User.singinRequired, User.updateUserInfos)
router.post('/fileUpload', User.singinRequired, User.fileUpload)

// Comment
router.post('/user/comment', User.singinRequired, Comment.save)
router.post('/set_comment', User.singinRequired, Comment.save)
router.post('/issue_comment', User.singinRequired, Comment.isSave)
router.get('/issue_operate', User.singinRequired, Comment.isOperate)
router.post('/commentDel', User.singinRequired, Comment.commentDel)

module.exports = router;


