let Auction = artifacts.require("./Auction.sol");

let auctionInstance;

contract('AuctionContract', function (accounts) {
 
  it("Contract deployment", function() {
    //Fetching the contract instance of our smart contract
    return Auction.deployed().then(function (instance) {
      //We save the instance in a gDlobal variable and all smart contract functions are called using this
      auctionInstance = instance;
      assert(auctionInstance !== undefined, 'Auction contract should be defined');
    });
  });

  it("Should set bidders", function() {
    return auctionInstance.register({from:accounts[1]}).then(function(result) {
        return auctionInstance.getPersonDetails(0);
    }).then(function(result) {
      assert.equal(result[2], accounts[1], 'bidder address set');
    })
  });

  it("Should NOT allow to bid more than remaining tokens", function() {
    return auctionInstance.bid(1,6,{from:accounts[1]})
    .then(function (result) {
      throw("Failed to check remaining tokens less than count");
    }).catch(function (e) {
      var a = e.toString();
      if(e === "Failed to check remaining tokens less than count") {
        assert(false);
      } else {
        assert(true);
      }
      })
  });

  //Modifier Checking
  it("Should NOT allow non owner to reveal winners", function() {
     return auctionInstance.revealWinners({from:accounts[1]})
     .then(function (instance) {
       throw("Failed to check owner in reveal winners");
     }).catch(function (e) {
       if(e === "Failed to check owner in reveal winners") {
         assert(false);
       } else {
         assert(true);
       }
     })
    });
    
  it("Should set winners", function() {
    return auctionInstance.register({from:accounts[2]})
    .then(function(result) {
        return auctionInstance.register({from:accounts[3]})
    }).then(function() {
        return auctionInstance.register({from:accounts[4]})
    }).then(function() {
        return auctionInstance.bid(0,5,{from:accounts[2]})
    }).then(function() {
        return auctionInstance.bid(1,5,{from:accounts[3]})
    }).then(function() {
        returnauctionInstance.bid(2,5,{from:accounts[4]})
    }).then(function() {
        return auctionInstance.revealWinners({from:accounts[0]})
    }).then(function() {
        return auctionInstance.winners(0)
    }).then(function(result) {
        assert(result !== '0x0000000000000000000000000000000000000000',"Winner could not be elected")
      return auctionInstance.winners(1);
    }).then(function(result) {
        assert(result !== '0x0000000000000000000000000000000000000000',"Winner could not be elected")
      return auctionInstance.winners(2);
    }).then(function(result) {
        assert(result !== '0x0000000000000000000000000000000000000000',"Winner could not be elected")
    })
  })
});