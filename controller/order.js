const Order = require('../moddel/order')
const handler = require('../middleware/handler')
const Product = require('../moddel/product')

function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => {
      const effectivePrice = item.sale && item.sale > 0 ? item.sale : item.price;
      return acc + effectivePrice * item.qty;
    },
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}



exports.create = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.sale && matchingItemFromDB.sale > 0 ? matchingItemFromDB.sale : matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    res.status(500).json(error.message);
  }
}



exports.allOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.userOrders = async(req,res) => {
  try {
    const orders =  await Order.find({ user:req.user._id })
    console.log(req.user);
    
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.totalOrders = async(req, res) => {
  try {
    const total = await Order.countDocuments()
    res.json(total)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


exports.totalSales = async(req, res) => {
  try {
    const orders =  await Order.find()
    const sales = orders.reduce( (sum, order) => sum + order.totalPrice, 0 )
    res.json(sales)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.salesByDate = async(req, res) => {
  try {
    const byDate = await Order.aggregate(
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },

    )

    res.json(byDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.orderById = async( req, res) => {
  try {
    const orders =  await Order.findById(req.params.id).populate('user', 'name email')

    if(orders) {
      res.json(orders)
    } else {
      res.status(404)
      throw new Error("No order found");
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.pay = async(req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


exports.delivered = async(req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}