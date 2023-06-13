export enum Status {
  ON = 1,
  OFF = 0,
}
export enum PayType {
  // 对公转账
  PUBLIC_TRANSFER = 1,
  // 快捷支付
  QUICK_PAY = 2,
}
/**
 * @description 订单状态
 */
export enum OrderStatus {
  // 交易关闭
  CLOSED = -1,
  // 未付款
  UNPAID = 0,
  // 付款中
  PAYING = 1,
  // 已付款，待发货
  PAID = 2,
  // 待收货
  DELIVERED = 3,
  // 交易完成
  FINISHED = 4,
}

/**
 * 任务状态
 */
export enum TaskStatus {
  // 初始化
  INIT = 0,
  // 进行中
  PROCESSING = 1,
  // 成功
  SUCCESS = 2,
  // 失败
  FAIL = 3,
}

/**
 * 任务状态
 */
export enum TechType {
  // 全局工艺
  OVERALL = 'overall',
  // 局部工艺
  PART = 'part',
  // 印刷工艺
  PRINT = 'print',
}

export enum TechTag {
  //材质
  material = 0,
  //印刷工艺
  printTech = 1,
  //全局工艺
  globalTech = 2,
  //局部工艺
  partTech = 3,
  //后道
  hd = 4,
  //模切
  moqie = 5,
}
