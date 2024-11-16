// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract OnChainReputation is ERC721Enumerable {
    // Struct to store user data
    struct User {
        uint256 reputationScore;
        uint256 borrowedCredits;
        uint256 banEndTime;
        bool hasProfile;
    }

    // Struct to store event data
    struct Event {
        uint256 id;
        string name;
        uint256 date;
        uint256 stakeAmount;
        address[] attendees;
        address[] noShows;
        bool finalized;
        mapping(address => bool) isRegistered;
    }

    // Mappings
    mapping(address => User) public users;
    mapping(uint256 => Event) public events;
    uint256 public eventCounter;

    // Constants
    uint256 public constant MAX_REPUTATION = 1000;
    uint256 public constant INITIAL_POINTS = 500;
    uint256 public constant CREDIT_LIMIT = 100;
    uint256 public constant INTEREST_RATE = 10; // 10% interest
    uint256 public constant BAN_DURATION = 10 days;
    uint256 public constant MIN_STAKE_AMOUNT = 1;

    // Events
    event ProfileCreated(address indexed user, uint256 initialPoints);
    event EventCreated(uint256 indexed eventId, string name, uint256 date, uint256 stakeAmount);
    event UserRegistered(address indexed user, uint256 indexed eventId);
    event EventFinalized(uint256 indexed eventId);

    constructor() ERC721("OnChainReputation", "OCR") {}

    // Modifier to check if user is banned
    modifier notBanned(address user) {
        require(users[user].banEndTime <= block.timestamp, "User is currently banned");
        _;
    }

    // Modifier to check if user has a profile
    modifier hasProfile(address user) {
        require(users[user].hasProfile, "User profile does not exist");
        _;
    }

    // Function to create a user profile
    function createProfile() external {
        require(!users[msg.sender].hasProfile, "Profile already exists");
        users[msg.sender] = User({
            reputationScore: INITIAL_POINTS,
            borrowedCredits: 0,
            banEndTime: 0,
            hasProfile: true
        });
        emit ProfileCreated(msg.sender, INITIAL_POINTS);
    }

    // Function to create an event
    function createEvent(
        string calldata name,
        uint256 date,
        uint256 stakeAmount
    ) external hasProfile(msg.sender) {
        require(date > block.timestamp, "Event date must be in the future");
        require(stakeAmount >= MIN_STAKE_AMOUNT, "Stake amount too low");
        require(stakeAmount <= MAX_REPUTATION, "Stake amount too high");

        eventCounter++;
        Event storage newEvent = events[eventCounter];
        newEvent.id = eventCounter;
        newEvent.name = name;
        newEvent.date = date;
        newEvent.stakeAmount = stakeAmount;
        newEvent.finalized = false;

        emit EventCreated(eventCounter, name, date, stakeAmount);
    }

    // Function to register for an event
    function registerForEvent(uint256 eventId) external notBanned(msg.sender) hasProfile(msg.sender) {
        Event storage eventDetails = events[eventId];
        require(eventDetails.id != 0, "Event does not exist");
        require(eventDetails.date > block.timestamp, "Event has already occurred");
        require(!eventDetails.finalized, "Event is already finalized");
        require(!eventDetails.isRegistered[msg.sender], "Already registered");
        require(users[msg.sender].reputationScore >= eventDetails.stakeAmount, "Insufficient points");

        // Deduct stake points and register user
        users[msg.sender].reputationScore -= eventDetails.stakeAmount;
        eventDetails.attendees.push(msg.sender);
        eventDetails.isRegistered[msg.sender] = true;

        emit UserRegistered(msg.sender, eventId);
    }

    // Function to finalize an event
    function finalizeEvent(uint256 eventId, address[] calldata noShows) external {
        Event storage eventDetails = events[eventId];
        require(eventDetails.id != 0, "Event does not exist");
        require(eventDetails.date <= block.timestamp, "Event has not occurred yet");
        require(!eventDetails.finalized, "Event is already finalized");

        // Verify no-shows were actually registered
        uint256 validNoShows = 0;
        for (uint256 i = 0; i < noShows.length; i++) {
            if (eventDetails.isRegistered[noShows[i]]) {
                eventDetails.noShows.push(noShows[i]);
                validNoShows++;
            }
        }

        // Calculate rewards
        if (validNoShows > 0 && eventDetails.attendees.length > validNoShows) {
            uint256 totalStake = validNoShows * eventDetails.stakeAmount;
            uint256 rewardPerUser = totalStake / (eventDetails.attendees.length - validNoShows);

            // Distribute rewards to attendees who weren't no-shows
            for (uint256 i = 0; i < eventDetails.attendees.length; i++) {
                address attendee = eventDetails.attendees[i];
                bool isNoShow = false;
                
                // Check if attendee was a no-show
                for (uint256 j = 0; j < eventDetails.noShows.length; j++) {
                    if (attendee == eventDetails.noShows[j]) {
                        isNoShow = true;
                        break;
                    }
                }

                if (!isNoShow) {
                    users[attendee].reputationScore += rewardPerUser;
                    if (users[attendee].reputationScore > MAX_REPUTATION) {
                        users[attendee].reputationScore = MAX_REPUTATION;
                    }
                }
            }
        }

        eventDetails.finalized = true;
        emit EventFinalized(eventId);
    }

    // Function to borrow credits
    function borrowCredits(uint256 amount) external notBanned(msg.sender) hasProfile(msg.sender) {
        User storage user = users[msg.sender];
        require(user.borrowedCredits == 0, "Existing credits must be repaid first");
        require(amount <= CREDIT_LIMIT, "Exceeds credit limit");

        user.borrowedCredits = amount;
        user.reputationScore += amount;
    }

    // Function to repay credits
    function repayCredits() external hasProfile(msg.sender) {
        User storage user = users[msg.sender];
        require(user.borrowedCredits > 0, "No credits to repay");
        uint256 repaymentAmount = user.borrowedCredits + (user.borrowedCredits * INTEREST_RATE / 100);
        require(user.reputationScore >= repaymentAmount, "Insufficient points to repay");

        user.reputationScore -= repaymentAmount;
        user.borrowedCredits = 0;
    }

    // Function to apply penalties for non-repayment
    function applyPenalty(address userAddress) external hasProfile(userAddress) {
        User storage user = users[userAddress];
        require(user.borrowedCredits > 0, "No borrowed credits");

        user.borrowedCredits = 0;
        user.banEndTime = block.timestamp + BAN_DURATION;
    }

    // View function to get user data
    function getUserData(address user) external view returns (
        uint256 reputationScore,
        uint256 borrowedCredits,
        uint256 banEndTime,
        bool hasProfile
    ) {
        User storage userData = users[user];
        return (
            userData.reputationScore,
            userData.borrowedCredits,
            userData.banEndTime,
            userData.hasProfile
        );
    }

    // View function to get event basic data
    function getEventBasicData(uint256 eventId) external view returns (
        uint256 id,
        string memory name,
        uint256 date,
        uint256 stakeAmount,
        bool finalized
    ) {
        Event storage eventData = events[eventId];
        return (
            eventData.id,
            eventData.name,
            eventData.date,
            eventData.stakeAmount,
            eventData.finalized
        );
    }

    // View function to get event attendees
    function getEventAttendees(uint256 eventId) external view returns (address[] memory) {
        return events[eventId].attendees;
    }

    // View function to get event no-shows
    function getEventNoShows(uint256 eventId) external view returns (address[] memory) {
        return events[eventId].noShows;
    }
}