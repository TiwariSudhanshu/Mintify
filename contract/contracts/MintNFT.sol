// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => string) public productMetadata;
    mapping(uint256 => address[]) public ownershipHistory;

    event ProductMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string productInfo
    );
    event ProductUpdated(uint256 indexed tokenId, string newProductInfo);
    event ProductTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    constructor() ERC721("ProductNFT", "PNFT") Ownable(msg.sender) {}

    function mintProductNFT(
        address recipient,
        string memory productInfo
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId;
        _safeMint(recipient, tokenId);
        productMetadata[tokenId] = productInfo;
        ownershipHistory[tokenId].push(recipient);
        emit ProductMinted(tokenId, recipient, productInfo);
        nextTokenId++;
        return tokenId;
    }

    function getProductDetails(
        uint256 tokenId
    ) public view returns (string memory, address) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (productMetadata[tokenId], ownerOf(tokenId));
    }

    function _existsPublic(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function getAllContractTokens() public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextTokenId; i++) {
            if (_ownerOf(i) != address(0)) {
                count++;
            }
        }

        uint256[] memory tokens = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextTokenId; i++) {
            if (_ownerOf(i) != address(0)) {
                tokens[index] = i;
                index++;
            }
        }
        return tokens;
    }

    function getOwnershipHistory(
        uint256 tokenId
    ) public view returns (address[] memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return ownershipHistory[tokenId];
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);
        ownershipHistory[tokenId].push(to);
        return previousOwner;
    }
}
