import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import router from 'umi/router';

@connect(({ collocation, loading }) => ({ collocation, loading }))
class index extends Component {
  componentDidMount() {
    this.getData({
      orderBy: 'recommend',
      page: 1,
    });
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getData = params => {
    const { id } = this.props.match.params;
    this.props.dispatch({
      type: 'collocation/getClassificationsList',
      payload: {
        clsId: id,
        ...params,
      },
    });
  };

  clickSort = order => {
    const { orderBy } = this.props.collocation.classificationsList;
    if (order !== orderBy) {
      this.getData({
        orderBy: order,
        page: 1,
      });
    }
  };

  handleScroll = e => {
    const body = document.querySelector('body');
    const { current_page, last_page, orderBy } = this.props.collocation.classificationsList;
    const loading = this.props.loading.effects['collocation/getClassificationsList'];
    if (
      body.scrollHeight - window.scrollY - body.clientHeight < 300 &&
      current_page < last_page &&
      !loading
    ) {
      this.getData({
        orderBy,
        page: current_page + 1,
      });
    }
  };

  toInfo = id => {
    router.push(`${this.props.location.pathname}/${id}`);
  };

  render() {
    const { data = [], orderBy } = this.props.collocation.classificationsList;
    const loading = this.props.loading.effects['collocation/getClassificationsList'];
    return (
      <Spin spinning={loading}>
        <div className={styles.sort}>
          <div
            className={orderBy === 'recommend' && styles.select}
            onClick={this.clickSort.bind(this, 'recommend')}
          >
            推荐
          </div>
          <div
            className={orderBy === 'priceLower' && styles.select}
            onClick={this.clickSort.bind(this, 'priceLower')}
          >
            最低
          </div>
          <div
            className={orderBy === 'priceHigher' && styles.select}
            onClick={this.clickSort.bind(this, 'priceHigher')}
          >
            最高
          </div>
          <div
            className={orderBy === 'hot' && styles.select}
            onClick={this.clickSort.bind(this, 'hot')}
          >
            最热
          </div>
        </div>
        <div className={styles.container}>
          {data.map(item => (
            <div
              onClick={this.toInfo.bind(this, item.collocation_id)}
              key={item.collocation_id}
              className={styles.item}
            >
              <img src={item.big_image} alt="" />
              <div>{item.info}</div>
            </div>
          ))}
        </div>
      </Spin>
    );
  }
}

export default index;