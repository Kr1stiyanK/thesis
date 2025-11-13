package com.tu.sofia.enums;

public enum LoyaltyRewardHours {
    ONE_HOUR(1),
    THREE_HOURS(3),
    SIX_HOURS(6),
    EIGHT_HOURS(8);

    private final int hours;

    LoyaltyRewardHours(int hours) {
        this.hours = hours;
    }

    public int getHours() {
        return hours;
    }
}
