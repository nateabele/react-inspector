import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

import { DEFAULT_ROOT_PATH, hasChildNodes, getExpandedPaths } from './pathUtils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_EXPAND': {
      const path = action.path;
      const expandedPaths = state.expandedPaths;
      const expanded = !!expandedPaths[path];

      return Object.assign({}, state, {
        expandedPaths: Object.assign({}, state.expandedPaths, { [path]: !expanded }),
      });
    }
    default:
      return state;
  }
};

class ConnectedTreeNode extends Component {

  constructor(props, context) {
    super(props);
    this.state = context.store.storeState;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !!nextState.expandedPaths[nextProps.path] !== !!this.state.expandedPaths[this.props.path] ||
      nextProps.data !== this.props.data ||
      nextProps.name !== this.props.name
    );
  }

  handleClick(path) {
    this.context.store.storeState = reducer(this.context.store.storeState, {
      type: 'TOGGLE_EXPAND',
      path: path,
    });
    this.setState(this.context.store.storeState);
  }

  renderChildNodes(parentData, parentPath) {
    const { dataIterator, depth, nodeRenderer, mapper } = this.props;
    let childNodes = [];

    for (let { name, data, ...props } of dataIterator(parentData)) {
      const key = name;
      const path = `${parentPath}.${key}`;
      childNodes.push(
        <ConnectedTreeNode depth={depth + 1} { ...{ name, data, path, key, mapper, dataIterator, nodeRenderer, ...props } } />,
      );
    }
    return childNodes;
  }

  render() {
    const { data, dataIterator, path, depth } = this.props;

    const nodeHasChildNodes = hasChildNodes(data, dataIterator);
    const { expandedPaths } = this.state;
    const expanded = !!expandedPaths[path];

    const { nodeRenderer } = this.props;

    return (
      <TreeNode
        expanded={expanded}
        onClick={nodeHasChildNodes ? this.handleClick.bind(this, path) : () => {}}
        // show arrow anyway even if not expanded and not rendering children
        shouldShowArrow={nodeHasChildNodes}
        // show placeholder only for non root nodes
        shouldShowPlaceholder={depth > 0}
        // Render a node from name and data (or possibly other props like isNonenumerable)
        nodeRenderer={nodeRenderer}
        {...this.props}
      >
        {// only render if the node is expanded
        expanded ? this.renderChildNodes(data, path) : undefined}
      </TreeNode>
    );
  }
}

ConnectedTreeNode.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,
  dataIterator: PropTypes.func,

  depth: PropTypes.number,
  expanded: PropTypes.bool,

  nodeRenderer: PropTypes.func,
};

ConnectedTreeNode.contextTypes = {
  store: PropTypes.any,
};

class TreeView extends Component {

  static defaultProps = {
    expandLevel: 0,
    expandPaths: [],
  };

  constructor(props) {
    super(props);

    this.store = {
      storeState: {
        expandedPaths: getExpandedPaths(
          props.data,
          props.dataIterator,
          props.expandPaths,
          props.expandLevel,
        ),
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.store = {
      storeState: {
        expandedPaths: getExpandedPaths(
          nextProps.data,
          nextProps.dataIterator,
          nextProps.expandPaths,
          nextProps.expandLevel,
          this.store.storeState.expandedPaths,
        ),
      },
    };
  }

  getChildContext() {
    return {
      store: this.store,
    };
  }

  static childContextTypes = {
    store: PropTypes.any,
  };

  render() {
    return (
      <ConnectedTreeNode depth={0} path={DEFAULT_ROOT_PATH} { ...this.props } />
    );
  }
}

TreeView.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,
  dataIterator: PropTypes.func,

  nodeRenderer: PropTypes.func,
  mapper: PropTypes.func,
};

TreeView.defaultProps = {
  name: undefined,
};

export default TreeView;
