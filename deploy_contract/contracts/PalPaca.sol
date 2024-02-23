// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PalPaca is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string baseURI;
    bool public paused = false;
    uint256 private _totalTokensMinted;

    uint256 public constant MAX_TOKENS = 1000;
    uint256 public constant MAX_TOKENS_PER_WALLET = 2;
    uint256 public constant ROYALTY_FEE_PERCENT = 5;

    constructor(
        string memory _initBaseURI
    ) ERC721("PalPaca", "PACA") Ownable(msg.sender) {
        setBaseURI(_initBaseURI);
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // public
    function _mint(uint256 _numTokens, address _to) internal {
        require(_totalTokensMinted < MAX_TOKENS, "All tokens have been minted");
        if (msg.sender != owner()) {
            require(
                balanceOf(_to) + _numTokens <= MAX_TOKENS_PER_WALLET,
                "Cannot mint more tokens than allowed per wallet"
            );
        }

        for (uint256 i = 0; i < _numTokens; i++) {
            uint256 tokenId = _totalTokensMinted + 1;
            _safeMint(_to, tokenId);
            _totalTokensMinted++;
        }
    }

    function mint(uint256 _numTokens) public {
        _mint(_numTokens, msg.sender);
    }

    function walletOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _totalTokensMinted >= tokenId,
            "ERC721Metadata: URI query for nonexistent token"
        );

        return
            bytes(_baseURI()).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    //only owner
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    //forgot to add
    function royaltyInfo(
        uint256 _salePrice
    ) external view returns (address receiver, uint256 royaltyAmount) {
        receiver = owner();
        royaltyAmount = (_salePrice * ROYALTY_FEE_PERCENT) / 100;
    }
}
