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
        //导入abi文件
        const nAbi = require("./abi/NTierCar.json")
        //合约地址
        const nAddress = "0xc29270cf76D77f1840e7ED67B9C4EB68aC815e14"
        //实例化合约
        window.nMyContract = new web3.eth.Contract(nAbi.abi,nAddress)
        console.log("nMyContract"+window.nMyContract)
        //--------------------------END -----------------------

        //------------------------定义质押---------------------
        //导入abi文件
        const tAbi = require("./abi/Staking.json")
        //合约地址
        window.tAddress = "0x7FC006357fc0EC1602f13d2FADe179b11f5C8056"
        //实例化合约
        window.tMyContract = new web3.eth.Contract(tAbi.abi,window.tAddress)
        console.log("tMyContract"+window.tMyContract)
        //--------------------------END -----------------------
         
        debugger;
        // --------------------------拍卖-----------------------------
        //导入abi文件
        const aAbi = require("./abi/AuctionMarket.json")
        //合约地址
        window.aAddress = "0xEf8d9cA370CE7262cC4EC70b2B0578EcBB4B8a4F"
        //实例化合约
        window.aMyContract = new web3.eth.Contract(aAbi.abi,  window.aAddress )
        console.log("aMyContract"+window.aMyContract)
       // ------------------------end--------------------------------------

       //---------------------------游戏-----------------------------------
        //导入abi文件
        const cgAbi = require("./abi/CarCarGameLogic.json")
        //定义N车型合约地址
        window.cgAddress = "0x07c634DE31ef43546b418Cdc42007bbBDbff3F81"
        //实例化合约
        window.cgMyContract = new web3.eth.Contract(cgAbi.abi,  window.cgAddress )
        console.log("cgMyContract"+window.aMyContract)
       //---------------------------------------------------


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

//质押
Stake =() =>{
  //质押策略id
  var strategyId = "0x30120cc9d265f9a5dc395a40de2e0e246a94f9ab9841b89fcdb28e978c6fdb52";
  window.tMyContract.methods.stake(strategyId).send({from:window.defaultAccount})
.on('transactionHash',(transactionHash)=>{
  console.log('transactionHash',transactionHash)
})
.on('confirmation',(confirmationNumber,receipt)=>{
  console.log({ confirmationNumber: confirmationNumber, receipt: receipt });
})
 
}

 //------------------------------end----------------------------------------

//--------------------------------2、拍卖----------------------------------------
  //授权
  MarketSetApprovalForAll =() =>{
    window.nMyContract.methods.setApprovalForAll(window.aAddress,true).send({from:window.defaultAccount})
  .on('transactionHash',(transactionHash)=>{
    console.log('transactionHash',transactionHash)
  })
  .on('confirmation',(confirmationNumber,receipt)=>{
    console.log({ confirmationNumber: confirmationNumber, receipt: receipt });
  })
}
//上架要拍卖的物品
SellItem =() =>{
    var __nftAddress = "0x79f1F1aBd8eB5b80110cfe4ccBF266958bb301f9";
    var tokenid =4;
    var _price = 1000 * Math.pow(10,-18);
    window.aMyContract.methods.sellItem(__nftAddress,tokenid,_price).send({from:window.defaultAccount})
  .on('transactionHash',(transactionHash)=>{
    console.log('transactionHash',transactionHash)
  })
  .on('confirmation',(confirmationNumber,receipt)=>{
    console.log({ confirmationNumber: confirmationNumber, receipt: receipt });
  })
}

//撤销拍卖
Revoke =() =>{
  var _aid = 0;
  window.aMyContract.methods.revoke(_aid).send({from:window.defaultAccount})
  .on('transactionHash',(transactionHash)=>{
  console.log('transactionHash',transactionHash)
  })
  .on('confirmation',(confirmationNumber,receipt)=>{
  console.log({ confirmationNumber: confirmationNumber, receipt: receipt });
  })
}
//购买物品
Purchase =() =>{
  var _aid = 0;
  window.aMyContract.methods.purchase(_aid).send({from:window.defaultAccount})
  .on('transactionHash',(transactionHash)=>{
  console.log('transactionHash',transactionHash)
  })
  .on('confirmation',(confirmationNumber,receipt)=>{
  console.log({ confirmationNumber: confirmationNumber, receipt: receipt });
  })
}
//--------------------------------end------------------------------------------

//--------------------------------3游戏中物品奖励----------------------------------


//------------------------------end-----------------------------------------------

//--------------------------4游戏过程---------------------------------------------
  //授权
  CarGameSetApprovalForAll =() =>{
    window.nMyContract.methods.setApprovalForAll(window.cgAddress,true).send({from:window.defaultAccount})
  .on('transactionHash',(transactionHash)=>{
    console.log('transactionHash',transactionHash)
  })
  .on('confirmation',(confirmationNumber,receipt)=>{
    console.log({ confirmationNumber: confirmationNumber, receipt: receipt });
  })
}

//进入游戏
EnterGame =() =>{
  var carNftAddress = "0x79f1F1aBd8eB5b80110cfe4ccBF266958bb301f9";
  var carid = 1;
  window.nMyContract.methods.enterGame(carNftAddress,carid).send({from:window.defaultAccount})
.on('transactionHash',(transactionHash)=>{
  console.log('transactionHash',transactionHash)
})
.on('confirmation',(confirmationNumber,receipt)=>{
  console.log({ confirmationNumber: confirmationNumber, receipt: receipt });
})
}

//退出游戏
ExitGame =() =>{
  var carNftAddress = "0x79f1F1aBd8eB5b80110cfe4ccBF266958bb301f9";
  var carid = 1;
  window.nMyContract.methods.exitGame(carNftAddress,carid).send({from:window.defaultAccount})
.on('transactionHash',(transactionHash)=>{
  console.log('transactionHash',transactionHash)
})
.on('confirmation',(confirmationNumber,receipt)=>{
  console.log({ confirmationNumber: confirmationNumber, receipt: receipt });
})
}
//修理车
Repair =() =>{
  var carNftAddress = "0x79f1F1aBd8eB5b80110cfe4ccBF266958bb301f9";
  var carid = 1;
  window.nMyContract.methods.repair(carNftAddress,carid).send({from:window.defaultAccount})
.on('transactionHash',(transactionHash)=>{
  console.log('transactionHash',transactionHash)
})
.on('confirmation',(confirmationNumber,receipt)=>{
  console.log({ confirmationNumber: confirmationNumber, receipt: receipt });
})
}

//--------------------------end--------------------------------------------------

render() {
  
  return (
    <div>
      <div> <button onClick={() => { this.StakingSetApprovalForAll() }}>质押授权</button></div>
      <div> <button onClick={() => { this.Stake() }}>质押</button></div>
      <div><span>----------------------------------------------------------</span></div>
      <div> <button onClick={() => { this.MarketSetApprovalForAll() }}>授权</button></div>
      <div> <button onClick={() => { this.Revoke() }}>上架拍卖</button></div>
      <div> <button onClick={() => { this.Purchase() }}>购买</button></div>
      <div> <button onClick={() => { this.Revoke() }}>撤销</button></div>
      <div><span>----------------------------------------------------------</span></div>
      <div> <button onClick={() => { this.CarGameSetApprovalForAll() }}>游戏授权</button></div>
      <div> <button onClick={() => { this.EnterGame() }}>进入游戏</button></div>
      <div> <button onClick={() => { this.ExitGame() }}>退出游戏</button></div>
      <div> <button onClick={() => { this.Repair() }}>修理</button></div>
    </div>
  );
}
}export default App;