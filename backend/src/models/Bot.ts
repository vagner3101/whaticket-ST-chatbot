import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  Default
} from "sequelize-typescript";

import User from "./User";
import Queue from "./Queue";

@Table
class Bot extends Model<Bot> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  commandBot: string;

  @Column
  commandType: number;

  @Default(null)
  @Column
  descriptionBot: string;

  @Default(null)
  @Column
  showMessage: string;

  @ForeignKey(() => User)
  @Default(null)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Queue)
  @Default(null)
  @Column
  queueId: number;

  @BelongsTo(() => Queue)
  queue: Queue;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Bot;
