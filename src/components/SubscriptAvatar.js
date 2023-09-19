import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import _ from 'underscore';
import lodashGet from 'lodash/get';
import styles from '../styles/styles';
import themeColors from '../styles/themes/default';
import Avatar from './Avatar';
import CONST from '../CONST';
import * as StyleUtils from '../styles/StyleUtils';
import avatarPropTypes from './avatarPropTypes';
import UserDetailsTooltip from './UserDetailsTooltip';

const propTypes = {
    /** Avatar URL or icon */
    mainAvatar: avatarPropTypes,

    /** Subscript avatar URL or icon */
    secondaryAvatar: avatarPropTypes,

    /** Set the size of avatars */
    size: PropTypes.oneOf(_.values(CONST.AVATAR_SIZE)),

    /** Background color used for subscript avatar border */
    backgroundColor: PropTypes.string,

    /** Removes margin from around the avatar, used for the chat view */
    noMargin: PropTypes.bool,

    /** Whether to show the tooltip */
    showTooltip: PropTypes.bool,
};

const defaultProps = {
    size: CONST.AVATAR_SIZE.DEFAULT,
    backgroundColor: themeColors.componentBG,
    mainAvatar: {},
    secondaryAvatar: {},
    noMargin: false,
    showTooltip: true,
};

function SubscriptAvatar({size, backgroundColor, mainAvatar, secondaryAvatar, noMargin, showTooltip}) {
    const isSmall = size === CONST.AVATAR_SIZE.SMALL;
    const subscriptStyle = size === CONST.AVATAR_SIZE.SMALL_NORMAL ? styles.secondAvatarSubscriptSmallNormal : styles.secondAvatarSubscript;
    const containerStyle = isSmall ? styles.emptyAvatarSmall : styles.emptyAvatar;
    // Default the margin style to what is normal for small or normal sized avatars
    let marginStyle = isSmall ? styles.emptyAvatarMarginSmall : styles.emptyAvatarMargin;

    // Some views like the chat view require that there be no margins
    if (noMargin) {
        marginStyle = {};
    }

    const mainAvatarElement = (
        <Avatar
            containerStyles={StyleUtils.getWidthAndHeightStyle(StyleUtils.getAvatarSize(size || CONST.AVATAR_SIZE.DEFAULT))}
            source={mainAvatar.source}
            size={size || CONST.AVATAR_SIZE.DEFAULT}
            name={mainAvatar.name}
            type={mainAvatar.type}
        />
    );

    const secondaryAvatarElement = (
        <View
            style={[size === CONST.AVATAR_SIZE.SMALL_NORMAL ? styles.flex1 : {}, isSmall ? styles.secondAvatarSubscriptCompact : subscriptStyle]}
            // Hover on overflowed part of icon will not work on Electron if dragArea is true
            // https://stackoverflow.com/questions/56338939/hover-in-css-is-not-working-with-electron
            dataSet={{dragArea: false}}
        >
            <Avatar
                iconAdditionalStyles={[
                    StyleUtils.getAvatarBorderWidth(isSmall ? CONST.AVATAR_SIZE.SMALL_SUBSCRIPT : CONST.AVATAR_SIZE.SUBSCRIPT),
                    StyleUtils.getBorderColorStyle(backgroundColor),
                ]}
                source={secondaryAvatar.source}
                size={isSmall ? CONST.AVATAR_SIZE.SMALL_SUBSCRIPT : CONST.AVATAR_SIZE.SUBSCRIPT}
                fill={themeColors.iconSuccessFill}
                name={secondaryAvatar.name}
                type={secondaryAvatar.type}
            />
        </View>
    );

    return (
        <View style={[containerStyle, marginStyle]}>
            {showTooltip ? (
                <UserDetailsTooltip
                    accountID={lodashGet(mainAvatar, 'id', -1)}
                    icon={mainAvatar}
                >
                    <View>{mainAvatarElement}</View>
                </UserDetailsTooltip>
            ) : (
                mainAvatarElement
            )}
            {showTooltip ? (
                <UserDetailsTooltip
                    accountID={lodashGet(secondaryAvatar, 'id', -1)}
                    icon={secondaryAvatar}
                >
                    {secondaryAvatarElement}
                </UserDetailsTooltip>
            ) : (
                secondaryAvatarElement
            )}
        </View>
    );
}

SubscriptAvatar.displayName = 'SubscriptAvatar';
SubscriptAvatar.propTypes = propTypes;
SubscriptAvatar.defaultProps = defaultProps;
export default memo(SubscriptAvatar);
