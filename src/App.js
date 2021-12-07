import React, { Component } from 'react';
import Web3 from "web3";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:0
    };
  }

  //链接钱包
  async componentDidMount() {

    //判断页面是否安装Metamask
    if (typeof window.ethereum !== 'undefined') {
      const ethereum = window.ethereum
      //禁止自动刷新，metamask要求写的
      ethereum.autoRefreshOnNetworkChange = false

      try {
        //第一次链接Metamask
        const accounts = await ethereum.enable()
        console.log(accounts)
        //初始化Provider
        const provider = window['ethereum']
        console.log(provider)
        //获取网络ID
        console.log(provider.chainId)
        //实例化Web3
        const web3 = new Web3(provider)     
        console.log(web3)
        // ---------------------定义n车型--------------------
        debugger;
        //导入abi文件
        const nAbi = require("./abi/NTierCar.json")
        //定义N车型合约地址
        const nAddress = "0xc29270cf76D77f1840e7ED67B9C4EB68aC815e14"
        //实例化合约
        window.nMyContract = new web3.eth.Contract(nAbi.abi,nAddress)
        console.log("nMyContract"+window.nMyContract)
        //--------------------------END -----------------------

        //------------------------定义质押---------------------
        //导入abi文件
        const tAbi = require("./abi/Staking.json")
        //定义N车型合约地址
        window.tAddress = "0x7FC006357fc0EC1602f13d2FADe179b11f5C8056"
        //实例化合约
        window.tMyContract = new web3.eth.Contract(tAbi.abi,window.tAddress)
        console.log("tMyContract"+window.tMyContract)
        //--------------------------END -----------------------



        window.defaultAccount = accounts[0].toLowerCase()
        console.log(window.defaultAccount)

        ethereum.on('accountsChanged', function (accounts) {
          console.log("accountsChanged:" + accounts)
        })
        ethereum.on('networkChanged', function (networkVersion) {
          console.log("networkChanged:" + networkVersion)
        })
      } catch (e) {

      }
    } else {
      console.log('没有metamask')
    }
    // 请求待释放数据


  }

  // ------------------------1、质押--------------------------------------------------------
  //授权
  StakingSetApprovalForAll =() =>{
    window.nMyContract.methods.setApprovalForAll(window.tAddress,true).send({from:window.defaultAccount})
  .on('transactionHash',(transactionHash)=>{
    console.log('transactionHash',transactionHash)
  })
  .on('confirmation',(confirmationNumber,receipt)=>{
    console.log({ confirmationNumber: confirmationNumber, receipt: receipt });
  })
}
//0x30120cc9d265f9a5dc395a40de2e0e246a94f9ab9841b89fcdb28e978c6fdb52
//质押
Stake =() =>{
  var strategyId = "0x30120cc9d265f9a5dc395a40de2e0e246a94f9ab9841b89fcdb28e978c6fdb52"
  window.tMyContract.methods.stake(strategyId).send({from:window.defaultAccount})
.on('transactionHash',(transactionHash)=>{
  console.log('transactionHash',transactionHash)
})
.on('confirmation',(confirmationNumber,receipt)=>{
  console.log({ confirmationNumber: confirmationNumber, receipt: receipt });
})
  //----------------------------------------------------------------------
}






render() {
  
  return (
    <div>
      <div> <button onClick={() => { this.StakingSetApprovalForAll() }}>质押授权</button></div>
      <div> <button onClick={() => { this.Stake() }}>质押</button></div>
    </div>
  );
}
}export default App;