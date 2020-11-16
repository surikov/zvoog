console.log('navigator.language', navigator.language);

function uselocale() {
	//return 'ru-';
	var navlan = navigator.language;
	//if (navlan.startsWith("en-")) return 'en-';
	if (navlan.startsWith("ru-")) return 'ru-';
	if (navlan.startsWith("fr-")) return 'fr-';
	if (navlan.startsWith("de-")) return 'de-';
	if (navlan.startsWith("es-")) return 'es-';
	if (navlan.startsWith("pt-")) return 'pt-';
	if (navlan.startsWith("it-")) return 'it-';
	if (navlan.startsWith("ja-")) return 'ja-';
	if (navlan.startsWith("ko-")) return 'ko-';
	if (navlan.startsWith("zh-")) return 'zh-';

	return 'en-';
}
console.log('uselocale', uselocale());
var localLabels = [
	{id: 'beforeAd', loc: [//
					{lang: 'en-', label: 'before ad'}
					,{lang: 'ru-',label: 'до рекламы'}
					,{lang: 'fr-',label: 'avant la publicité'}
					,{lang: 'de-',label: 'vor Werbung'}
					,{lang: 'es-',label: 'antes de la publicidad'}
					,{lang: 'pt-',label: 'antes da publicidade'}
					,{lang: 'it-',label: 'prima della pubblicità'}
					,{lang: 'ja-',label: '広告'}
					,{lang: 'ko-',label: '광고하는'}
					,{lang: 'zh-',label: '广告'}
	]},{id: 'urlCopied', loc: [//
					{lang: 'en-', label: 'Chord progression URL copied to clipboard.'}
					,{lang: 'ru-',label: 'URL прогрессии скопирован в буфер.'}
					,{lang: 'fr-',label: 'URL de progression de l\'accord copiée dans le presse-papiers'}
					,{lang: 'de-',label: 'Akkordfortschritts-URL in die Zwischenablage kopiert'}
					,{lang: 'es-',label: 'URL de progreso de acordes copiada al portapapeles'}
					,{lang: 'pt-',label: 'URL de progresso do acorde copiado para a área de transferência'}
					,{lang: 'it-',label: 'prima dellaURL di avanzamento accordi copiato negli appunti pubblicità'}
					,{lang: 'ja-',label: 'Chord ProgressURLがクリップボードにコピーされました'}
					,{lang: 'ko-',label: '코드 진행 URL이 클립 보드에 복사되었습니다.'}
					,{lang: 'zh-',label: '和弦进度URL复制到剪贴板'}
	]},{id: 'resetList', loc: [//
					{lang: 'en-', label: 'reset'}
					,{lang: 'ru-',label: 'сброс'}
					,{lang: 'fr-',label: 'réinitialiser'}
					,{lang: 'de-',label: 'zurücksetzen'}
					,{lang: 'es-',label: 'Reiniciar'}
					,{lang: 'pt-',label: 'Redefinir'}
					,{lang: 'it-',label: 'Ripristina'}
					,{lang: 'ja-',label: 'リセット'}
					,{lang: 'ko-',label: '초기화'}
					,{lang: 'zh-',label: '重启'}
	]},{id: 'addNew', loc: [//
					{lang: 'en-', label: 'New progression'}
					,{lang: 'ru-',label: 'Добавить'}
					,{lang: 'fr-',label: 'Ajouter'}
					,{lang: 'de-',label: 'Hinzufügen'}
					,{lang: 'es-',label: 'Añadir'}
					,{lang: 'pt-',label: 'Adicionar'}
					,{lang: 'it-',label: 'Inserisci'}
					,{lang: 'ja-',label: '追加'}
					,{lang: 'ko-',label: '더하다'}
					,{lang: 'zh-',label: '加'}
	]},{id: 'deleteProgression', loc: [//
					{lang: 'en-', label: 'Delete progression'}
					,{lang: 'ru-',label: 'Удалить'}
					,{lang: 'fr-',label: 'Effacer'}
					,{lang: 'de-',label: 'Löschen'}
					,{lang: 'es-',label: 'Eliminar'}
					,{lang: 'pt-',label: 'Excluir'}
					,{lang: 'it-',label: 'Elimina'}
					,{lang: 'ja-',label: '削除'}
					,{lang: 'ko-',label: '지우다'}
					,{lang: 'zh-',label: '删除'}
	]},{id: 'resetConfirm', loc: [//
					{lang: 'en-', label: 'Remove all custom progressions and reset list.'}
					,{lang: 'ru-',label: 'Удалите все пользовательские прогрессии и сбросьте список.'}
					,{lang: 'fr-',label: 'Supprimez toutes les progressions personnalisées et réinitialisez la liste.'}
					,{lang: 'de-',label: 'Entfernen Sie alle benutzerdefinierten Progressionen und setzen Sie die Liste zurück.'}
					,{lang: 'es-',label: 'Elimina todas las progresiones personalizadas y restablece la lista.'}
					,{lang: 'pt-',label: 'Remova todas as progressões personalizadas e redefina a lista.'}
					,{lang: 'it-',label: 'Rimuovi tutte le progressioni personalizzate e ripristina l\'elenco.'}
					,{lang: 'ja-',label: 'すべてのカスタムプログレッションを削除し、リストをリセットします。'}
					,{lang: 'ko-',label: '모든 사용자 지정 진행률을 제거하고 목록을 재설정합니다.'}
					,{lang: 'zh-',label: '删除所有自定义进度并重置列表。'}
	]}
];
function loLabel(key){
	var ulo=uselocale();
	for(var i=0;i<localLabels.length;i++){
		if(localLabels[i].id==key){
			for(var k=0;k<localLabels[i].loc.length;k++){
				if(localLabels[i].loc[k].lang==ulo){
					return localLabels[i].loc[k].label;
				}
			}
		}
	}
	return key;
}
