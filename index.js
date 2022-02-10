#!/usr/bin/env node

// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的文件头
// 如果是Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改

const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')


async function run() {
    program
        .version(`v${require('./package.json').version}`)
        .command('create <name>')
        .usage('<command> [option]')
        .description('creare a new vue project')
        .option('-f, --force', '强制创建，如果创建的目录存在则覆盖原有目录')
        .action(async(name, options) => {
            const result = await require('./lib/create.js')(name, options)
            if (result) {
                console.log('工程', chalk.green(name), '已成功创建')
            }

        })
    program.on('--help', () => {
        console.log('\r\n', figlet.textSync('ycocli', {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            with: 80,
            whitespaceBreak: true
        }))
    })
    program.parse()
}
run()