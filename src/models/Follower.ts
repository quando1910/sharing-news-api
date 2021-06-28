import { DataTypes, Model, Optional } from 'sequelize';
import db  from '../config/database';
import { FollowerErrors } from '../lib/api-error';
import { User } from './User';

interface FollowerAttributes {
  id: number;
  followerId: number;
  followingId: number;
}

interface FollowerCreationAttributes extends Optional<FollowerAttributes, 'id'> { }

export class Follower extends Model<FollowerAttributes, FollowerCreationAttributes> implements FollowerAttributes, FollowerCreationAttributes {
  public id!: number;
  public followerId!: number;
  public followingId!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static async createFollower(data: any, authInfo: any) {
    if (authInfo.userId === data.followingId) throw FollowerErrors.INTERACT_PERMISSION;

    const userTemp = await User.findOne({
      where: { id: data.followingId }
    });

    if (!userTemp) throw FollowerErrors.NOT_FOUND;

    const followerTemp = await Follower.findOne({
      where: { followerId: authInfo.userId, followingId: data.followingId }
    });

    if (followerTemp) throw FollowerErrors.ALREADY_FOLLOWER_EXISTED;

    const followerData = new Follower({
      followingId: data.followingId,
      followerId: authInfo.userId
    });
    await followerData.save();
    return 'Follow successfully.';
  }

  public static async deleteFollower(data: any, authInfo: any) {
    if (authInfo.userId === data.followingId) throw FollowerErrors.INTERACT_PERMISSION;

    const followerTemp = await Follower.findOne({
      where: { followerId: authInfo.userId, followingId: data.followingId }
    });

    if (!followerTemp) throw FollowerErrors.NOT_FOUND;

    await followerTemp.destroy();
    return 'Unfolowing successfully.';
  }
}

Follower.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  followerId: {
    type: DataTypes.INTEGER,
    references: { model: 'Users', key: 'id' }
  },
  followingId: {
    type: DataTypes.INTEGER,
    references: { model: 'Users', key: 'id' }
  },
}, {
  // Other model options go here
  sequelize: db.sequelize, // We need to pass the connection instance
  tableName: 'Followers' // We need to choose the model name
});
