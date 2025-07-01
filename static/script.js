let extensions = []

function addExtension() {
    const extInput = document.getElementById('extensionInput')
    let ext = extInput.value.trim().toLowerCase()
    if (!ext) return
    if (!ext.startsWith('.')) ext = '.' + ext
    if (!/^\.[a-z0-9]+$/.test(ext)) {
        alert("Invalid extension format")
        return
    }
    if (extensions.includes(ext)) return
    extensions.push(ext)
    const chip = document.createElement('div')
    chip.className = 'chip'
    chip.innerHTML = `${ext}<span class="remove" onclick="removeExtension('${ext}')">×</span>`
    document.getElementById('chips').appendChild(chip)
    extInput.value = ''
    checkStartReady()
}

function removeExtension(ext) {
    extensions = extensions.filter(e => e !== ext)
    document.querySelectorAll('.chip').forEach(chip => {
        if (chip.textContent.includes(ext)) chip.remove()
    })
    checkStartReady()
}

function checkStartReady() {
    const folder = document.getElementById('folderPath').value.trim()
    document.getElementById('startBtn').disabled = !(folder && extensions.length)
}

async function startScan() {
    const folder = document.getElementById('folderPath').value.trim()
    const response = await fetch('/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, extensions })
    })
    const result = await response.json()

    const output = document.getElementById('output')
    if (result.error) {
        output.textContent = result.error
    } else if (result.warning === 'too_many_files') {
        if (!confirm(`Over 1000 files found (${result.count}). Continue?`)) return
        startScan()
        return
    } else {
        output.textContent = result.data.join('\n\n')
    }
    output.style.display = 'block'
}

function copyOutput() {
    const text = document.getElementById('output').textContent
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied!')
    })
}
