// File: @openzeppelin/contracts/utils/Context.sol

// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

// File: @openzeppelin/contracts/token/ERC20/IERC20.sol

// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

// File: @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol

// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface for the optional metadata functions from the ERC20 standard.
 *
 * _Available since v4.1._
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}

// File: @openzeppelin/contracts/token/ERC20/ERC20.sol

// OpenZeppelin Contracts (last updated v4.7.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC20
 * applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
contract ERC20 is Context, IERC20, IERC20Metadata {
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function airdrop(
        address sender,
        address reciever,
        uint256 amount
    ) internal returns (bool) {
        require(amount < _balances[sender], "Not enough tokens left");
        _balances[sender] -= amount;
        _balances[reciever] += amount;
        emit Airdrop(reciever, amount);
        return true;
    }

    event Airdrop(address indexed candidacy, uint256 amount);

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `amount`.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue)
        public
        virtual
        returns (bool)
    {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue)
        public
        virtual
        returns (bool)
    {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(
            currentAllowance >= subtractedValue,
            "ERC20: decreased allowance below zero"
        );
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /**
     * @dev Moves `amount` of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(
            fromBalance >= amount,
            "ERC20: transfer amount exceeds balance"
        );
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
     *
     * Does not update the allowance amount in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Might emit an {Approval} event.
     */
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(
                currentAllowance >= amount,
                "ERC20: insufficient allowance"
            );
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * will be transferred to `to`.
     * - when `from` is zero, `amount` tokens will be minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * has been transferred to `to`.
     * - when `from` is zero, `amount` tokens have been minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}
}

// File: Dao.sol

//SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract DAO is ERC20 {
    struct candidacy {
        string name;
        string companyName;
        string job;
        string postaladdress;
        string number;
        string email;
        string weblink;
        string description;
    }

    struct candidateProposal {
        address candidate;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 timeStart;
        uint256 timeEnd;
        address[] sponsors;
        mapping(address => bool) voted;
    }

    address public treasureWallet; //owner
    mapping(address => bool) public SponsorsApproved;
    mapping(address => candidateProposal) public candPropDetails;
    mapping(address => candidacy) public candidacyData;
    mapping(address => bool) public blacklisted;
    mapping(address => bool) public whitelisted;
    mapping(address => uint256) public score;
    address[] public daoMembers;

    constructor() ERC20("Test", "TT") {
        treasureWallet = msg.sender;
        _mint(treasureWallet, 100000000 * 10**18);
        //The deployer is treasure wallet/1st dao member/owner, with whole supply of tokens
        Whitelist(treasureWallet);
    }

    function getSponsorsOfProposal(address user)
        public
        view
        returns (address[] memory)
    {
        // return candidancyProposals[user].sponsors;
    }

    modifier onlyOwner() {
        require(msg.sender == treasureWallet, "Owner Call Only");
        _;
    }

    modifier onlyMember() {
        require(whitelisted[msg.sender], "For Members Only");
        _;
    }

    function trasferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "user is not valid");
        treasureWallet = newOwner;
        transfer(newOwner, balanceOf(msg.sender));
    }

    //Blacklisting and Whitelisting
    function Blacklist(address member) public onlyOwner {
        require(!blacklisted[member], "Address is already blacklisted");
        blacklisted[member] = true;
    }

    function RemoveFromBlacklist(address member) public onlyOwner {
        require(blacklisted[member], "Address is not blacklisted");
        blacklisted[member] = false;
    }

    function Whitelist(address member) public onlyOwner {
        require(!blacklisted[member], "address is blacklisted");
        require(!whitelisted[member], "Address is already whitelisted");
        whitelisted[member] = true;
        daoMembers.push(member);
        score[member] += 1;
        memberslen += 1;
        if (candPropDetails[member].sponsors.length >= 0) {
            for (uint i = 0; i < candPropDetails[member].sponsors.length; i++) {
                address j = candPropDetails[member].sponsors[i];
                score[j] += 100;
            }
        }
    }

    function RemoveFromWhitelist(address member) public onlyOwner {
        require(whitelisted[member], "Address is not whitelisted");
        whitelisted[member] = false;
    }

    function SubmitToDao(
        string memory _name,
        string memory _weblink,
        string memory _job,
        string memory desc,
        string memory _email,
        string memory _companyName,
        string memory _postaddress,
        string memory _number
    ) public {
        require(
            !blacklisted[msg.sender] && !whitelisted[msg.sender],
            "Form is for candidacy only"
        );
        candidacyData[msg.sender].name = _name;
        candidacyData[msg.sender].companyName = _companyName;
        candidacyData[msg.sender].job = _job;
        candidacyData[msg.sender].postaladdress = _postaddress;
        candidacyData[msg.sender].number = _number;
        candidacyData[msg.sender].email = _email;
        candidacyData[msg.sender].weblink = _weblink;
        candidacyData[msg.sender].description = desc;
        candPropDetails[msg.sender].timeStart = block.timestamp;
        candPropDetails[msg.sender].timeEnd = block.timestamp + 48 hours;
    }

    //candidacy can add sponsors, can only choose from DAO members coz they are sponsors
    function addSponsors(address _sponsors) public {
        require(
            candPropDetails[msg.sender].sponsors.length < 2,
            "You can add 2 sponsors max"
        );
        candPropDetails[msg.sender].sponsors.push(_sponsors);
    }

    function getSponsors(address _candidacy)
        public
        view
        returns (address[] memory)
    {
        return candPropDetails[_candidacy].sponsors;
    }

    //The sponsors can approve/sign their candidacies sponsorship

    //Candidate sponsors will be approved, either they are 1 or 2;
    function signSponsorship(address _candidate) public onlyMember {
        for (uint i = 0; i < candPropDetails[_candidate].sponsors.length; i++) {
            address j = candPropDetails[_candidate].sponsors[i];
            require(
                msg.sender == j,
                "You're not the sponsor of this candidate"
            );
            SponsorsApproved[_candidate] = true;
        }
    }

    uint256 private memberslen = daoMembers.length;
    uint256 private totalVotes;

    function VoteForCandidacyProposal(address _candidacy, bool _vote)
        public
        onlyMember
    {
        require(whitelisted[msg.sender], "You are not a DAO Member");
        require(
            block.timestamp <= candPropDetails[_candidacy].timeEnd,
            "This Vote has been closed"
        );
        score[msg.sender] += 1;
        totalVotes += 1;
        if (_vote) {
            calculateForVotes(_candidacy, totalVotes, memberslen);
            calculateResults(
                _candidacy,
                candPropDetails[_candidacy].forVotes,
                candPropDetails[_candidacy].againstVotes
            );
        } else {
            calculateAgainstVotes(_candidacy, totalVotes, memberslen);
        }
    }

    function calculateForVotes(
        address _candidacy,
        uint256 numOfVotes,
        uint256 totalMembers
    ) internal {
        candPropDetails[_candidacy].forVotes +=
            (numOfVotes / totalMembers) *
            100;
    }

    function calculateAgainstVotes(
        address _candidacy,
        uint256 numOfVotes,
        uint256 totalMembers
    ) internal {
        candPropDetails[_candidacy].againstVotes +=
            (numOfVotes / totalMembers) *
            100;
    }

    function calculateResults(
        address candid,
        uint256 forVotes,
        uint256 againstVotes
    ) internal {
        if (block.timestamp >= candPropDetails[candid].timeEnd) {
            if (forVotes > againstVotes) {
                Whitelist(candid);
                if (memberslen <= 100) {
                    airdrop(treasureWallet, candid, 10000 * 10**18);
                }
                if (memberslen > 100 && memberslen <= 1000) {
                    airdrop(treasureWallet, candid, 5000 * 10**18);
                }
                if (memberslen > 1000 && memberslen <= 10000) {
                    airdrop(treasureWallet, candid, 2500 * 10**18);
                }
            } else {
                blacklisted[candid] = true;
            }
        }
    }
}
