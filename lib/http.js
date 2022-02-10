// 专门处理模板和版本信息的处理
const axios = require('axios')

axios.interceptors.response.use(res => {
    return res.data
})

/**
 * 获取模板列表
 * @return Promise
 */
async function getRepolist() {
    return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}

/**
 * 获取版本信息
 * @param {string} repo 模版名称
 * @return Promise
 */
async function getTagList(repo) {
    return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}

module.exports = {
    getRepolist,
    getTagList
}