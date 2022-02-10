// 处理项目创建逻辑
const ora = require('ora')
const { getRepolist, getTagList } = require('./http')
const inquirer = require('inquirer')
const util = require('util')
const downloadGitRepo = require('download-git-repo')
const path = require('path')
const chalk = require('chalk')

async function loading(fn, message, ...args) {
    const spinner = ora(message)
        // 开始加载动画
    spinner.start()
    try {
        const result = await fn(...args);
        // 动画状态成功
        spinner.succeed();
        return result
    } catch (error) {
        spinner.fail('请求失败，请重试...')
    }
}

class Generator {
    constructor(name, targetDir) {
        // 目录名称
        this.name = name
            // 创建位置
        this.targetDir = targetDir
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }

    async download(repo, tag) {
        const url = `zhurong-cli/${repo}${tag?'#'+tag:''}`;
        await loading(
            this.downloadGitRepo,
            '正在下载模板...',
            url,
            path.resolve(process.cwd(), this.targetDir) //保存位置
        )
    }

    async getRepo() {
        const repoList = await loading(getRepolist, '加载模板列表')
        if (!repoList) return;

        const repos = repoList.map(item => item.name)
            // 让用户自己选择模板
        const { repo } = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: '请选择你想使用的模板'
        })

        return repo
    }

    async getTag(repo) {
        const tags = await loading(getTagList, `获取${repo}的版本信息`, repo)
        if (!tags) return;
        const tagList = tags.map(item => item.name)
        const { tag } = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tagList,
            message: '请选择你想使用的模板版本'
        })
        return tag
    }

    // 创建逻辑
    async create() {
        const repo = await this.getRepo()
        const tag = await this.getTag(repo)
        await this.download(repo, tag)
        console.log(`\r\n 成功创建工程${chalk.cyan(this.name)}`)
        console.log(`\r\n cd ${chalk.cyan(this.name)}`)
        console.log('\r\n npm install && npm run serve')
    }
}

module.exports = Generator