import Mock from 'mockjs'
export default function (isMock) {
    if(!isMock) return;
    Mock.mock("/ffff/eeee",{name:"aaa",age:"111"})
}