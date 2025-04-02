export type ConnectionPoolDto = {
  
  /**
   * 连接ID，用于唯一标识一个连接。
   */
  connectionId: string;

  /**
   * 客户端ID，用于唯一标识一个客户端。
   */
  clientId: string;

  /**
   * 主机名或IP地址，表示连接所在的主机。
   */
  host: string;

  /**
   * 用户ID，用于标识连接的用户。
   * 可以为空，表示没有关联的用户。
   */
  userId?: string | null;
  /**
   * 用户名，表示连接的用户名称。
   */
  userName?: string | null;

  /**
   * 设备ID，用于标识连接使用的设备。
   */
  deviceId: string;

  /**
   * IP地址，表示连接的客户端IP。
   */
  ipAddress: string;

  /**
   * 浏览器信息，包含浏览器类型和版本等。
   */
  browserInfo: string;

  /**
   * 设备信息，包含设备类型和操作系统等。
   */
  deviceInfo: string;

  /**
   * 聊天对象Id列表，表示连接关联的聊天对象Id。
   */
  chatObjectIdList: number[];

  /**
   * 活跃时间，表示连接最后一次活跃的时间。
   */
  activeTime: string | Date | null;

  /**
   * 创建时间，表示连接被创建的时间。
   */
  creationTime: string | Date | null;
};
