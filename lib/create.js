const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk')
const Generator = require('./generator')

module.exports = async function(name, options) {
    // 当前命令行选择的目录
    const cwd = process.cwd()
        // 需要创建的目录地址
    const targetDir = path.join(cwd, name)
    if (fs.existsSync(targetDir)) {
        if (options.force) {
            await fs.remove(targetDir)
        } else {
            // 询问是否删除
            const override = await inquirer.prompt({
                type: 'input',
                name: 'override',
                message: `是否确定要覆盖${name}?`,
                default: 'yes',
            })
            if (override.override.indexOf('y') !== -1 || override.override.indexOf('Y') !== -1) {
                await fs.remove(targetDir)
            } else {
                console.log(chalk.red('创建失败'))
                return false
            }
        }
    }

    const generator = new Generator(name, targetDir)
    generator.create()
}