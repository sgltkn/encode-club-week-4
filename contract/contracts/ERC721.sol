// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyNFT is ERC721, AccessControl, ERC721Burnable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private tokenCounter;

    constructor() ERC721("MyToken", "MTK") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        tokenCounter = 0;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "http://localhost:3000/";
    }

    function safeMint(address _to) public onlyRole(MINTER_ROLE) {
        _safeMint(_to, tokenCounter);
        tokenCounter++;
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
