import { useState } from 'react'
import {
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileTextOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { H5AgentNotesSheet } from './h5-agent-ui'

const LOGIN_ROLES = {
  gaodashang: 'main',
  wc002: 'secondary',
  dailiwc001: 'independent',
  gaodashang_ml: 'multiLevel',
}

export function H5AgentLogin({ onBack, onLogin, note, notesOpen, onOpenNotes, onCloseNotes, onToast = () => {} }) {
  const [account, setAccount] = useState('gaodashang')
  const [password, setPassword] = useState('qq123456')
  const [visible, setVisible] = useState(false)
  const [remember, setRemember] = useState(true)

  const submit = (event) => {
    event.preventDefault()
    const normalized = account.trim().toLowerCase()
    if (!normalized || password.length < 6) {
      onToast('请输入代理账号和至少6位登录密码', 'warning')
      return
    }
    onLogin({ account: account.trim(), role: LOGIN_ROLES[normalized] || 'main' })
  }

  return <main className="h5-agent-preview-stage"><section className="h5-agent-phone h5-agent-login-phone" aria-label="H5代理登录">
    <header className="h5-agent-login-topbar">
      <button type="button" aria-label="返回后台" onClick={onBack}><ArrowLeftOutlined /></button>
      <button type="button" onClick={onOpenNotes}><FileTextOutlined /><span>业务说明</span></button>
    </header>
    <div className="h5-agent-login-content">
      <section className="h5-agent-login-brand">
        <span><SafetyCertificateOutlined /></span>
        <div><small>AGENT CONSOLE</small><h1>代理后台</h1><p>登录后进入当前代理身份的经营中心</p></div>
      </section>
      <form className="h5-agent-login-form" onSubmit={submit}>
        <header><h2>代理登录</h2><p>请输入代理账号和登录密码</p></header>
        <label><span>代理账号</span><div><UserOutlined /><input value={account} onChange={(event) => setAccount(event.target.value)} autoComplete="username" placeholder="请输入代理账号" /></div></label>
        <label><span>登录密码</span><div><LockOutlined /><input type={visible ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="请输入登录密码" /><button type="button" aria-label={visible ? '隐藏密码' : '显示密码'} onClick={() => setVisible((current) => !current)}>{visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}</button></div></label>
        <div className="h5-agent-login-options"><label><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span>记住账号</span></label><button type="button" onClick={() => onToast('请联系站点管理员重置登录密码')}>忘记密码</button></div>
        <button type="submit" className="h5-agent-login-submit">登录</button>
        <p className="h5-agent-login-demo">演示账号：gaodashang、WC002、dailiwc001、gaodashang_ml</p>
      </form>
    </div>
    <footer className="h5-agent-login-footer">旺财体育 · 代理经营管理后台</footer>
    <H5AgentNotesSheet note={note} open={notesOpen} onClose={onCloseNotes} />
  </section></main>
}
